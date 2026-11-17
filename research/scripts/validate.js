import { loadDataset, validateDataset } from '../lib/data.js';
for (const name of ['synthetic','real','real-derived','hard','combined']) console.log(validateDataset(await loadDataset(name)));
