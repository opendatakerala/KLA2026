import { readCSV, writeJSON, ensureOutputDir, cleanString } from './utils/common.js';

function getAlliance(allianceFromCSV) {
  if (allianceFromCSV && ['LDF', 'UDF', 'NDA'].includes(allianceFromCSV)) {
    return allianceFromCSV;
  }
  return 'Others';
}

function generate() {
  ensureOutputDir();
  
  const candidates = readCSV('2026-candidates.csv');
  const constituencies = readCSV('2026-constituencies.csv');
  
  const constituencyToDistrict = {};
  constituencies.forEach(row => {
    const qid = cleanString(row.constituency_Wikidata);
    if (qid) {
      constituencyToDistrict[qid] = cleanString(row.district);
    }
  });
  
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
    const alliance = getAlliance(cleanString(cand.alliance));
    let party = cleanString(cand.party_y);
    if (!party) party = 'Independent';
    const qid = cleanString(cand.constituency_Wikidata);
    const district = qid ? constituencyToDistrict[qid] : null;
    
    if (!gender) return;
    
    let genderKey = 'unknown';
    if (gender === 'male') genderKey = 'male';
    else if (gender === 'female') genderKey = 'female';
    else if (gender === 'transgender') genderKey = 'transgender';
    
    result.overall[genderKey]++;
    
    result.byAlliance[alliance][genderKey]++;
    
    if (!result.byParty[party]) {
      result.byParty[party] = { male: 0, female: 0, transgender: 0, unknown: 0 };
    }
    result.byParty[party][genderKey]++;
    
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
