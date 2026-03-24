import { readCSV, writeJSON, ensureOutputDir, parseNumber } from './utils/common.js';

function categorizeCriminal(criminalCases, convictions) {
  const cases = parseNumber(criminalCases);
  const convicts = parseNumber(convictions);
  
  if (cases === null && convicts === null) return 'Unknown';
  if (cases === null || cases === 0) {
    if (convicts === null || convicts === 0) return 'No Cases';
    return 'Convicted';
  }
  if (convicts === null || convicts === 0) return 'Pending Cases';
  if (convicts > 0) return 'Convicted';
  
  return 'Unknown';
}

function generate() {
  ensureOutputDir();
  
  const candidates = readCSV('2026-candidates.csv');
  
  const categories = ['No Cases', 'Pending Cases', 'Convicted', 'Unknown'];
  
  const result = {
    overall: categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}),
    byAlliance: {
      LDF: categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}),
      UDF: categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}),
      NDA: categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}),
      Others: categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {})
    }
  };
  
  candidates.forEach(cand => {
    const category = categorizeCriminal(cand['Criminal Case'], cand.Convictions);
    let alliance = cand.alliance || 'Others';
    
    result.overall[category] = (result.overall[category] || 0) + 1;
    if (result.byAlliance[alliance]) {
      result.byAlliance[alliance][category] = (result.byAlliance[alliance][category] || 0) + 1;
    }
  });
  
  writeJSON('criminal-cases.json', result);
  console.log('Generated: criminal-cases.json');
}

export default generate;
