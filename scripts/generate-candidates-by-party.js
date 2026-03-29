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
  
  const result = {
    LDF: {},
    UDF: {},
    NDA: {},
    Others: {}
  };
  
  candidates.forEach(cand => {
    const alliance = getAlliance(cleanString(cand.alliance));
    let party = cleanString(cand.party_y);
    if (!party) party = 'Independent';
    
    if (!result[alliance][party]) {
      result[alliance][party] = 0;
    }
    result[alliance][party]++;
  });
  
  Object.keys(result).forEach(alliance => {
    const parties = Object.keys(result[alliance]).sort((a, b) => 
      result[alliance][b] - result[alliance][a]
    );
    const sortedResult = {};
    parties.forEach(party => {
      sortedResult[party] = result[alliance][party];
    });
    result[alliance] = sortedResult;
  });
  
  writeJSON('candidates-by-party.json', result);
  console.log('Generated: candidates-by-party.json');
}

export default generate;
