import { readCSV, writeJSON, ensureOutputDir, cleanString } from './utils/common.js';

function generate() {
  ensureOutputDir();
  
  const candidates = readCSV('2026-candidates.csv');
  
  const symbolCounts = {};
  
  candidates.forEach(cand => {
    const symbol = cleanString(cand.Symbol);
    if (symbol) {
      symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
    }
  });
  
  const sorted = Object.entries(symbolCounts)
    .sort((a, b) => b[1] - a[1])
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
  
  writeJSON('symbol-distribution.json', sorted);
  console.log('Generated: symbol-distribution.json');
}

export default generate;