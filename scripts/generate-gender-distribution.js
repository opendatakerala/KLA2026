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
    },
    byParty: {},
    byDistrict: {}
  };
  
  candidates.forEach(cand => {
    const gender = cleanString(cand.candidate_Gender).toLowerCase();
    const alliance = cleanString(cand.alliance) || 'Others';
    const party = cleanString(cand.party) || 'Others';
    const district = cleanString(cand.district);
    
    if (!gender) return;
    
    let genderKey = 'unknown';
    if (gender === 'male') genderKey = 'male';
    else if (gender === 'female') genderKey = 'female';
    else if (gender === 'transgender') genderKey = 'transgender';
    
    // Overall
    result.overall[genderKey]++;
    
    // By Alliance
    if (result.byAlliance[alliance]) {
      result.byAlliance[alliance][genderKey]++;
    }
    
    // By Party
    if (!result.byParty[party]) {
      result.byParty[party] = { male: 0, female: 0, transgender: 0, unknown: 0 };
    }
    result.byParty[party][genderKey]++;
    
    // By District
    if (district) {
      if (!result.byDistrict[district]) {
        result.byDistrict[district] = { male: 0, female: 0, transgender: 0, unknown: 0 };
      }
      result.byDistrict[district][genderKey]++;
    }
  });
  
  writeJSON('gender-distribution.json', result);
  console.log('Generated: gender-distribution.json');
}

export default generate;