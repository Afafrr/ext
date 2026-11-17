import test from 'node:test';
import assert from 'node:assert/strict';
import { loadDataset,validateDataset,canonicalURL,normalizeTitle } from '../lib/data.js';
import { rankFolders,centroid,keywordScore,retrieveAndRerank,prediction,summarize,textFor } from '../lib/scoring.js';
import { validateConfig } from '../lib/config.js';
import { readFile } from 'node:fs/promises';
import { buildReportData } from '../scripts/report.js';

test('datasets have valid labels, coverage and separate indexes',async()=>{
  const synthetic=await loadDataset('synthetic'),real=await loadDataset('real');
  assert.equal(validateDataset(synthetic).cases,150);
  assert.equal(validateDataset(real).cases,21);
  for(const c of synthetic.collections)assert.equal(synthetic.evaluation.filter(q=>q.collectionId===c.id).length,30);
  assert.equal(synthetic.evaluation.filter(q=>q.tags.includes('duplicate')).length,5);
});
test('real-derived expansion stays synthetic and reuses the unchanged real index',async()=>{
  const original=await loadDataset('real'),derived=await loadDataset('real-derived');
  const stats=validateDataset(derived);
  assert.equal(stats.cases,120);assert.equal(stats.duplicateCopies,0);
  assert.deepEqual(derived.index,original.index);
  assert.equal(original.evaluation.length,21);
  assert.ok(derived.evaluation.every(row=>row.synthetic===true && row.provenance.includes('synthetic')));
  const originalTitles=new Set(original.evaluation.map(row=>normalizeTitle(row.title)));
  assert.ok(derived.evaluation.every(row=>!originalTitles.has(normalizeTitle(row.title))));
  for(const folder of original.collections[0].folders)assert.equal(derived.evaluation.filter(row=>row.expectedFolder===folder.path).length,20);
  const config=validateConfig(JSON.parse(await readFile('benchmark.minilm.real-derived.config.json','utf8')));
  assert.equal(config.dataset,'real-derived');assert.equal(config.strategies.length,9);
});
test('hard dataset has nested trees, multilingual shorthand, isolated users and separate examples',async()=>{
  const data=await loadDataset('hard'),stats=validateDataset(data);
  assert.equal(stats.cases,180);assert.equal(stats.collections,3);assert.equal(stats.indexed,72);
  assert.equal(stats.noFolder,9);assert.equal(stats.duplicateCopies,6);
  assert.ok(stats.review>0);
  assert.ok(data.evaluation.every(row=>row.synthetic && row.provenance && row.languages.length));
  const languages=new Set(data.evaluation.flatMap(row=>row.languages).filter(lang=>lang!=='und'));
  assert.equal(languages.size,6);
  for(const tag of ['abbreviation','shorthand','mixed-language','cross-language','noisy-metadata','vague-title','typo']) {
    assert.ok(data.evaluation.some(row=>row.tags.includes(tag)),tag);
  }
  const descriptions=JSON.parse(await readFile('datasets/hard/descriptions.json','utf8'));
  for(const collection of data.collections) {
    assert.equal(collection.folders.length,10);
    assert.equal(data.evaluation.filter(row=>row.collectionId===collection.id).length,60);
    assert.ok(collection.folders.some(folder=>folder.path.split('/').length>=3));
    assert.ok(collection.folderTree.some(node=>!node.selectable));
    for(const folder of collection.folders)assert.equal(descriptions.folders[`${collection.id}/${folder.path}`].manual,folder.description);
  }
  const config=validateConfig(JSON.parse(await readFile('benchmark.minilm.hard.config.json','utf8')));
  assert.equal(config.dataset,'hard');assert.equal(config.strategies.length,7);
  const first=data.evaluation.find(row=>row.expectedFolder!==null);
  const report=buildReportData({status:'complete',config,results:[{id:'closest',dataset:'hard',rows:[{
    ...first,queryMs:1,certainEnough:false,top3:[{folder:first.expectedFolder,score:.4},{folder:'other',score:.3}]
  }]}]});
  assert.equal(report.summary[0][0],'hard (synthetic)');
});
test('hard dataset validation rejects broken hierarchy and collection references',async()=>{
  const data=await loadDataset('hard');
  const node=data.collections[0].folderTree.find(node=>node.parentPath!==null);
  node.parentPath='missing';assert.throws(()=>validateDataset(data),/Invalid parent/);
  const clean=await loadDataset('hard');
  clean.evaluation[0].collectionId='unknown';assert.throws(()=>validateDataset(clean),/Unknown collection/);
});
test('leakage guards reject normalized titles, tracking URLs and duplicate groups',async()=>{
  for(const kind of ['title','url','group']){
    const d=await loadDataset('synthetic'),q=d.evaluation[0],i=d.index[0];
    if(kind==='title')q.title=i.title.toUpperCase()+'!!!';
    if(kind==='url')q.url=i.url+'?utm_source=test#top';
    if(kind==='group')i.duplicateGroup=q.duplicateGroup;
    assert.throws(()=>validateDataset(d),/leakage/);
  }
  assert.equal(canonicalURL('https://a.example/x?b=2&utm_source=x&a=1#x'),'https://a.example/x?a=1&b=2');
});
test('closest and prototype weighted strategy can select different folders',()=>{
  const folders=[{path:'A',vectors:{path:[0,1]},examples:[[1,0],[.5,.5]]},{path:'B',vectors:{path:[1,0]},examples:[[.9,.1]]},{path:'C',vectors:{path:[0,1]},examples:[[0,1]]}];
  assert.equal(rankFolders([1,0],folders,'closest')[0].folder,'A');
  const ranked=rankFolders([1,0],folders,'folder-closest');
  assert.equal(ranked[0].folder,'B');assert.ok(Math.abs(ranked[0].score-.93)<1e-12);
});
test('certainty does not reject the first folder, and no-folder cases are unscored',()=>{
  const thresholds={newFolder:.55,askUserMargin:.05};
  const ranked=[{folder:'A',score:.4},{folder:'B',score:.2},{folder:'C',score:.1}];
  const out=prediction(ranked,{expectedFolder:'A'},thresholds,'closest');
  assert.equal(out.correct,true);assert.equal(out.certainEnough,false);
  assert.equal(prediction(ranked,{expectedFolder:null},thresholds,'closest').correct,null);
  assert.equal(prediction(ranked,{expectedFolder:'A'},thresholds,'rerank').certainEnough,null);
  assert.equal(summarize([{...out,queryMs:1}]).accuracy,1);
});
test('configuration allows only supported strategies and query fields',async()=>{
  assert.equal(textFor({title:'A',headings:['B','C'],expectedFolder:'secret'},['title','headings']),'A. B. C');
  const config=JSON.parse(await readFile('benchmark.config.json','utf8'));
  validateConfig(config);config.fields.push('expectedFolder');assert.throws(()=>validateConfig(config),/query fields/);
});
test('simple report scores the first folder independently of certainty and rejection',()=>{
  const row=(id,expectedFolder,folder,score,second)=>({id,collectionId:'one',title:id,expectedFolder,
    predicted:null,correct:false,decision:'new-folder',queryMs:2,top3:[{folder,score},{folder:'other',score:second}]});
  const rows=[row('a','A','A',.4,.2),row('b','B','A',.8,.7),row('c',null,'A',.9,.3)];
  const run={status:'complete',config:{datasets:['synthetic'],thresholds:{newFolder:.55,askUserMargin:.05}},results:[{id:'test',dataset:'synthetic',rows}]};
  const data=buildReportData(run);
  assert.deepEqual(data.summary[0],['synthetic','test',.5,.5,1,1,2]);
  assert.deepEqual(data.datasets[0].cases.map(r=>[r[6],r[7]]),[['No','Correct'],['Yes','Wrong'],['Yes','Not scored']]);
  run.results.push({id:'shuffled',dataset:'synthetic',rows:[...rows].reverse()});
  assert.deepEqual(buildReportData(run).datasets[0].cases.map(r=>r[0]),['a','a','b','b','c','c']);
  run.results[1].rows.pop();assert.throws(()=>buildReportData(run),/mismatch/);
});
test('simple report handles no eligible folders and incomplete runs',()=>{
  const run={status:'complete',config:{datasets:['real'],thresholds:{newFolder:.55,askUserMargin:.05}},results:[{id:'test',dataset:'real',rows:[{id:'a',collectionId:'one',title:'a',expectedFolder:null,queryMs:3,top3:[{folder:'A',score:.7},{folder:'B',score:.6}]}]}]};
  assert.deepEqual(buildReportData(run).summary[0],['real','test',null,'n.a.',0,0,3]);
  run.status='failed';assert.throws(()=>buildReportData(run),/complete/);
});
test('top-3 averaging reduces an outlier and handles sparse folders',()=>{
  const folders=[{path:'outlier',examples:[[1,0],[0,1],[0,1],[0,1]]},{path:'stable',examples:[[.8,.6],[.8,.6]]}];
  assert.equal(rankFolders([1,0],folders,'closest')[0].folder,'outlier');
  const ranked=rankFolders([1,0],folders,'top3-average');
  assert.equal(ranked[0].folder,'stable');assert.equal(ranked[0].score,.8);
  assert.equal(ranked[1].score,1/3);
});
test('centroids are normalized and keyword matching respects whole technology names',()=>{
  const mean=centroid([[1,0],[0,1]]);
  assert.ok(Math.abs(Math.hypot(...mean)-1)<1e-12);
  assert.equal(keywordScore('Ruby SQL','Ruby on Rails'),.5);
  assert.equal(keywordScore('Java','JavaScript'),0);
  assert.equal(keywordScore('C++ React.js','C++ React.js'),1);
});
test('description variants are independent, and hybrid adds exact match evidence',()=>{
  const a={path:'A',examples:[[.5,0]],vectors:{path:[0,1],manual:[1,0],generated:[0,1],domain:[1,0]},keywordText:'Ruby'};
  const b={path:'B',examples:[[.6,0]],vectors:{path:[1,0],manual:[0,1],generated:[1,0],domain:[0,1]},keywordText:'SQL'};
  assert.equal(rankFolders([1,0],[a,b],'manual-closest')[0].folder,'A');
  assert.equal(rankFolders([1,0],[a,b],'generated-closest')[0].folder,'B');
  assert.equal(rankFolders([1,0],[a,b],'domain-closest')[0].folder,'A');
  assert.equal(rankFolders([1,0],[a,b],'hybrid','Ruby')[0].folder,'A');
});
test('reranking only scores retrieved candidates and can reverse their order',async()=>{
  const folders=['A','B','C','D'].map((path,i)=>({path,vectors:{manual:[1,0]},examples:[[1-i*.1,0]],rerankText:path}));
  const calls=[];
  const ranked=await retrieveAndRerank([1,0],'query',folders,async(q,d)=>{calls.push([q,d]);return d==='B'?4:1;},3);
  assert.equal(ranked[0].folder,'B');assert.deepEqual(calls.map(c=>c[1]),['A','B','C']);
  assert.equal(ranked.length,3);assert.equal(ranked[0].retrievalScore,.3+.7*.9);
});
