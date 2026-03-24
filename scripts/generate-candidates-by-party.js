import { readCSV, writeJSON, ensureOutputDir } from './utils/common.js';

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
    const alliance = cand.alliance;
    const party = cand.party;
    
    if (!alliance || !party) return;
    
    if (!result[alliance]) {
      alliance = 'Others';
    }
    
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
