import { readCSV, writeJSON, ensureOutputDir, cleanString } from './utils/common.js';

function generate() {
  ensureOutputDir();
  
  const candidates = readCSV('2026-candidates.csv');
  
  const result = {
    overall: { male: 0, female: 0, transgender: 0, unknown: 0 },
    byAlliance: {
      LDF: { male: 0, female: 0, transgender: 0, unknown: 0 },
      UDF: { male: 0, female: 0, transgender: 0, unknown: 0 },
      NDA: { male: 0, female: 0, transgender: 0, unknown: 0 },
      Others: { male: 0, female: 0, transgender: 0, unknown: 0 }
    }
  };
  
  candidates.forEach(cand => {
    const gender = cleanString(cand.candidate_Gender).toLowerCase();
    let alliance = cand.alliance || 'Others';
    
    if (!gender) return;
    
    let genderKey = 'unknown';
    if (gender === 'male') genderKey = 'male';
    else if (gender === 'female') genderKey = 'female';
    else if (gender === 'transgender') genderKey = 'transgender';
    
    result.overall[genderKey]++;
    if (result.byAlliance[alliance]) {
      result.byAlliance[alliance][genderKey]++;
    }
  });
  
  writeJSON('gender-distribution.json', result);
  console.log('Generated: gender-distribution.json');
}

export default generate;
