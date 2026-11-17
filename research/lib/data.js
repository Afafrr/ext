import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
export const hash = value => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
export const readJSON = async file => JSON.parse(await readFile(file, 'utf8'));
export const normalizeTitle = text => text.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
export function canonicalURL(value) {
  if (!value) return '';
  const url = new URL(value);
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) if (/^(utm_|fbclid|gclid)/i.test(key)) url.searchParams.delete(key);
  url.searchParams.sort();
  return url.href.replace(/\/$/, '');
}
export async function loadDataset(name, root = 'datasets') {
  if (name === 'real-derived') {
    const original = await loadDataset('real', root);
    return {
      ...original, name,
      provenance: 'SYNTHETIC evaluation pages authored around the six original real folders. Original 11 indexed examples and description variants are reused unchanged; these are not additional real user bookmarks.',
      evaluation: await readJSON(`${root}/real/derived-evaluation.json`)
    };
  }
  if (['synthetic', 'hard', 'combined'].includes(name)) {
    const [collections, index, evaluation] = await Promise.all(['collections','index','evaluation'].map(file => readJSON(`${root}/${name}/${file}.json`)));
    return { name, provenance: name === 'combined'
      ? 'Combined real (21), synthetic real-derived (120), and synthetic hard (180) cases. Original collection-local candidate folders and shared real index retained; sourceDataset identifies each evaluation source.'
      : name === 'hard'
      ? 'HARD SYNTHETIC browser snapshots: fictional users, nested folder trees, multilingual and abbreviated titles. Authored expected destinations, not observed real user decisions.'
      : 'Authored synthetic data; fictional users and reserved .example URLs.', collections, index, evaluation };
  }
  if (name !== 'real') throw new Error(`Unknown dataset: ${name}`);
  const original = await readJSON(`${root}/real/original-evaluation.json`);
  const { folders } = await import(new URL(`../${root}/real/original-folders.js`, import.meta.url));
  return { name, provenance: 'Unmodified prototype evaluation export. Index contains real examples plus illustrative job titles from prototype.',
    collections: [{ id: 'real-user', synthetic: false, habit: 'Original prototype folders and labels.', folders: folders.map(({path,description=''}) => ({path,description})) }],
    index: folders.flatMap((folder,f) => folder.bookmarks.map((title,i) => ({id:`real-index-${f}-${i}`,collectionId:'real-user',folder:folder.path,title,description:'',headings:[]}))),
    evaluation: original.map(item => ({...item, collectionId:'real-user', synthetic:false,
      explanation:'Original expected folder retained from prototype; no new human adjudication.', ambiguous:false,
      acceptableAlternatives:[], tags:['original-real'], duplicateGroup:item.id })) };
}
export function validateDataset(data) {
  const fail = message => { throw new Error(`${data.name}: ${message}`); };
  if (!data.collections?.length || !data.index?.length || !data.evaluation?.length) fail('Empty dataset');
  const unique = (items,label) => { if (new Set(items).size !== items.length) fail(`Duplicate ${label}`); };
  unique(data.collections.map(c=>c.id),'collection ID');
  unique([...data.index,...data.evaluation].map(c=>c.id),'case/index ID');
  const folders = new Map(data.collections.map(c=>[c.id,new Set(c.folders.map(f=>f.path))]));
  for (const c of data.collections) {
    unique(c.folders.map(f=>f.path),`folder in ${c.id}`);
    if (c.folderTree) {
      unique(c.folderTree.map(node=>node.path), `tree node in ${c.id}`);
      const tree = new Map(c.folderTree.map(node=>[node.path,node]));
      for (const node of c.folderTree) {
        const expectedParent = node.path.includes('/') ? node.path.slice(0,node.path.lastIndexOf('/')) : null;
        if (node.parentPath !== expectedParent || (node.parentPath !== null && !tree.has(node.parentPath))) fail(`Invalid parent for ${c.id}/${node.path}`);
        if (node.selectable !== folders.get(c.id).has(node.path)) fail(`Invalid selectable tree node ${c.id}/${node.path}`);
      }
      for (const folder of c.folders) if (!tree.has(folder.path)) fail(`Folder missing from tree ${c.id}/${folder.path}`);
    }
    if (c.folders.length < 3) fail(`Need at least three folders in ${c.id}`);
    for (const f of c.folders) if (!data.index.some(i=>i.collectionId===c.id && i.folder===f.path)) fail(`Empty folder ${c.id}/${f.path}`);
  }
  for (const item of [...data.index,...data.evaluation]) {
    if (!folders.has(item.collectionId)) fail(`Unknown collection for ${item.id}`);
    if (typeof item.title !== 'string' || typeof item.description !== 'string' || !Array.isArray(item.headings) || item.headings.some(h=>typeof h!=='string')) fail(`Invalid text fields: ${item.id}`);
    if (item.url) canonicalURL(item.url);
  }
  for (const i of data.index) if (!folders.get(i.collectionId).has(i.folder)) fail(`Invalid index folder ${i.id}`);
  for (const q of data.evaluation) {
    if (q.expectedFolder !== null && !folders.get(q.collectionId).has(q.expectedFolder)) fail(`Invalid expected folder ${q.id}`);
    if (!q.explanation || typeof q.ambiguous !== 'boolean' || !q.duplicateGroup) fail(`Missing annotation ${q.id}`);
    if (!Array.isArray(q.acceptableAlternatives) || q.acceptableAlternatives.some(f=>!folders.get(q.collectionId).has(f))) fail(`Invalid alternatives ${q.id}`);
    if (q.acceptableAlternatives.length && !q.ambiguous) fail(`Alternative without review flag ${q.id}`);
    // Global checks are deliberately stricter than collection-local retrieval.
    for (const i of data.index) {
      if (normalizeTitle(q.title) && normalizeTitle(q.title) === normalizeTitle(i.title)) fail(`Title leakage ${q.id} / ${i.id}`);
      if (q.url && i.url && canonicalURL(q.url) === canonicalURL(i.url)) fail(`URL leakage ${q.id} / ${i.id}`);
      if (i.duplicateGroup && q.duplicateGroup === i.duplicateGroup) fail(`Group leakage ${q.id} / ${i.id}`);
    }
  }
  const groups = new Map();
  for (const q of data.evaluation) {
    const key = `${q.collectionId}:${q.duplicateGroup}`;
    if (groups.has(key) && groups.get(key).expectedFolder !== q.expectedFolder) fail(`Conflicting duplicate labels ${q.id}`);
    groups.set(key,q);
  }
  for (let a=0;a<data.evaluation.length;a++) for(let b=a+1;b<data.evaluation.length;b++) {
    const x=data.evaluation[a],y=data.evaluation[b];
    if(x.collectionId!==y.collectionId) continue;
    const same = normalizeTitle(x.title) === normalizeTitle(y.title) || (x.url && y.url && canonicalURL(x.url)===canonicalURL(y.url));
    if(same && x.duplicateGroup!==y.duplicateGroup) fail(`Unmarked evaluation duplicate ${x.id} / ${y.id}`);
  }
  return { dataset:data.name, collections:data.collections.length, indexed:data.index.length, cases:data.evaluation.length,
    review:data.evaluation.filter(q=>q.ambiguous).length, noFolder:data.evaluation.filter(q=>q.expectedFolder===null).length,
    duplicateCopies:data.evaluation.length-groups.size, fingerprint:hash(data) };
}
