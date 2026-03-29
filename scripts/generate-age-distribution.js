import { readCSV, writeJSON, ensureOutputDir, cleanString } from './utils/common.js';

function getAlliance(allianceFromCSV) {
  if (allianceFromCSV && ['LDF', 'UDF', 'NDA'].includes(allianceFromCSV)) {
    return allianceFromCSV;
  }
  return 'Others';
}

function getAgeBin(age) {
  const a = parseInt(age, 10);
  if (isNaN(a)) return 'unknown';
  if (a < 20) return 'under20';
  if (a < 30) return '20-29';
  if (a < 40) return '30-39';
  if (a < 50) return '40-49';
  if (a < 60) return '50-59';
  if (a < 70) return '60-69';
  if (a < 80) return '70-79';
  return '80+';
}

function filterZeros(obj) {
  const result = {};
  for (const key in obj) {
    if (obj[key] !== 0) {
      result[key] = obj[key];
    }
  }
  return result;
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
  
  const rawResult = {
    overall: {
      under20: 0,
      '20-29': 0,
      '30-39': 0,
      '40-49': 0,
      '50-59': 0,
      '60-69': 0,
      '70-79': 0,
      '80+': 0,
      unknown: 0
    },
    byAlliance: {
      LDF: {
        under20: 0, '20-29': 0, '30-39': 0, '40-49': 0, '50-59': 0, '60-69': 0, '70-79': 0, '80+': 0, unknown: 0
      },
      UDF: {
        under20: 0, '20-29': 0, '30-39': 0, '40-49': 0, '50-59': 0, '60-69': 0, '70-79': 0, '80+': 0, unknown: 0
      },
      NDA: {
        under20: 0, '20-29': 0, '30-39': 0, '40-49': 0, '50-59': 0, '60-69': 0, '70-79': 0, '80+': 0, unknown: 0
      },
      Others: {
        under20: 0, '20-29': 0, '30-39': 0, '40-49': 0, '50-59': 0, '60-69': 0, '70-79': 0, '80+': 0, unknown: 0
      }
    },
    byParty: {},
    byDistrict: {}
  };
  
  candidates.forEach(cand => {
    const age = cleanString(cand['age_x affidavit']);
    const alliance = getAlliance(cleanString(cand.alliance));
    let party = cleanString(cand.party_y);
    if (!party) party = 'Independent';
    const qid = cleanString(cand.constituency_Wikidata);
    const district = qid ? constituencyToDistrict[qid] : null;
    
    const ageBin = getAgeBin(age);
    
    rawResult.overall[ageBin]++;
    
    rawResult.byAlliance[alliance][ageBin]++;
    
    if (!rawResult.byParty[party]) {
      rawResult.byParty[party] = {
        under20: 0, '20-29': 0, '30-39': 0, '40-49': 0, '50-59': 0, '60-69': 0, '70-79': 0, '80+': 0, unknown: 0
      };
    }
    rawResult.byParty[party][ageBin]++;
    
    if (district) {
      if (!rawResult.byDistrict[district]) {
        rawResult.byDistrict[district] = {
          under20: 0, '20-29': 0, '30-39': 0, '40-49': 0, '50-59': 0, '60-69': 0, '70-79': 0, '80+': 0, unknown: 0
        };
      }
      rawResult.byDistrict[district][ageBin]++;
    }
  });
  
  const result = {
    overall: filterZeros(rawResult.overall),
    byAlliance: {},
    byParty: {},
    byDistrict: {}
  };
  
  for (const alliance in rawResult.byAlliance) {
    result.byAlliance[alliance] = filterZeros(rawResult.byAlliance[alliance]);
  }
  
  for (const party in rawResult.byParty) {
    result.byParty[party] = filterZeros(rawResult.byParty[party]);
  }
  
  for (const district in rawResult.byDistrict) {
    result.byDistrict[district] = filterZeros(rawResult.byDistrict[district]);
  }
  
  writeJSON('age-distribution.json', result);
  console.log('Generated: age-distribution.json');
}

export default generate;
