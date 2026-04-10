import fs from 'fs';
import path from 'path';
import { readCSV, writeJSON, ensureOutputDir, cleanString } from './utils/common.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'data');

function getAlliance(party, allianceFromCSV) {
  if (allianceFromCSV && ['LDF', 'UDF', 'NDA', 'Others'].includes(allianceFromCSV)) {
    return allianceFromCSV;
  }
  return 'Others';
}

function levenshteinDistance(a, b) {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  return matrix[b.length][a.length];
}

function findBestMatch(name, candidates, maxDistance = 2) {
  let bestMatch = null;
  let bestDistance = Infinity;
  for (const candidate of candidates) {
    const distance = levenshteinDistance(name.toLowerCase(), candidate.toLowerCase());
    if (distance < bestDistance && distance <= maxDistance) {
      bestDistance = distance;
      bestMatch = candidate;
    }
  }
  return bestMatch ? { match: bestMatch, distance: bestDistance } : null;
}

function generate() {
  ensureOutputDir();

  const candidates = readCSV('2026-candidates.csv');
  const constituencies = readCSV('2026-constituencies.csv');
  const alliances = readCSV('2026-alliances.csv');
  const fightIndexData = readCSV('2026-fight-index.csv');

  const fightIndexByConstituency = {};
  const fightIndexByDistrict = {};
  fightIndexData.forEach(row => {
    const district = cleanString(row.District);
    const constituency = cleanString(row.Constituency);
    const fightIndex = cleanString(row.FightIndex);
    if (district && constituency && fightIndex) {
      fightIndexByConstituency[`${district}|${constituency}`] = fightIndex;
      if (!fightIndexByDistrict[district]) {
        fightIndexByDistrict[district] = [];
      }
      fightIndexByDistrict[district].push(constituency);
    }
  });

  const partyToAlliance = {};
  alliances.forEach(row => {
    const alliance = cleanString(row.Alliance);
    const party = cleanString(row.Party);
    if (alliance && party) {
      partyToAlliance[party] = alliance;
    }
  });

  const constituencyData = {};
  constituencies.forEach(row => {
    const qid = cleanString(row.constituency_Wikidata);
    if (qid) {
      constituencyData[qid] = {
        name: cleanString(row.constituency_Name),
        nameMalayalam: cleanString(row['constituency_Name_ (Malayalam)']),
        district: cleanString(row.district),
        districtMalayalam: cleanString(row.district_malayalam),
        districtQid: cleanString(row.distrct_Wikidata),
        number: cleanString(row.constituency_Number),
        reservation: cleanString(row.reservation),
        pollingBooths: cleanString(row['Polling Booths']),
        votersMale: cleanString(row['Voters Male']),
        votersFemale: cleanString(row['Voters Female']),
        votersTransgender: cleanString(row['Voters Third Gender']),
        votersTotal: cleanString(row['Voters Total'])
      };
    }
  });

  const grouped = {};
  const unmatchedConstNames = [];
  const fuzzyMatches = [];
  candidates.forEach(cand => {
    const qid = cleanString(cand.constituency_Wikidata);
    if (!qid) return;

    const constData = constituencyData[qid];
    if (!constData) return;

    if (!grouped[qid]) {
      const district = constData.district;
      const constName = constData.name;
      const fightKey = `${district}|${constName}`;
      let fightIndex = fightIndexByConstituency[fightKey];

      if (!fightIndex && fightIndexByDistrict[district]) {
        const result = findBestMatch(constName, fightIndexByDistrict[district], 3);
        if (result) {
          const fuzzyKey = `${district}|${result.match}`;
          fightIndex = fightIndexByConstituency[fuzzyKey];
          fuzzyMatches.push({ district, from: constName, to: result.match, distance: result.distance });
        }
      }

      if (!fightIndex) {
        unmatchedConstNames.push({ district, name: constName });
      }

      grouped[qid] = {
        number: constData.number,
        name: constData.name,
        nameMalayalam: constData.nameMalayalam,
        district: constData.district,
        districtMalayalam: constData.districtMalayalam,
        districtQid: constData.districtQid,
        qid: qid,
        reservation: constData.reservation,
        pollingBooths: constData.pollingBooths,
        votersMale: constData.votersMale,
        votersFemale: constData.votersFemale,
        votersTransgender: constData.votersTransgender,
        votersTotal: constData.votersTotal,
        candidates: []
      };
      if (fightIndex) {
        grouped[qid].fightIndex = fightIndex;
      }
    }

    const party = cleanString(cand.party_y);
    const alliance = getAlliance(party, cleanString(cand.alliance));

    const name = cleanString(cand.candidate_Name);
    if (!name) return;
    
    const archiveUrl = cleanString(cand.archive_url);
    const archiveId = archiveUrl?.replace('https://archive.org/details/', '');

    const candidateObj = {};

    if (alliance) candidateObj.alliance = alliance;
    if (party) candidateObj.party = party;
    if (name) candidateObj.name = name;
    const malayalam = cleanString(cand.Malayalam);
    if (malayalam) candidateObj.malayalam = malayalam;
    const wikidata = cleanString(cand.candidate_Wikidata);
    if (wikidata) candidateObj.wikidata = wikidata;
    const gender = cleanString(cand.candidate_Gender);
    if (gender) candidateObj.gender = gender;
    const age = cleanString(cand['age_x affidavit']);
    if (age) candidateObj.age = age;
    const candidateId = cleanString(cand.candidate_id);
    if (candidateId) candidateObj.candidateId = candidateId;
    const photo = cleanString(cand.photo_filename);
    if (photo) candidateObj.photo = photo;
    const reference = cleanString(cand.Reference);
    if (reference) candidateObj.reference = reference;
    const symbol = cleanString(cand.Symbol);
    if (symbol) candidateObj.symbol = symbol;
    if (archiveId) candidateObj.archiveUrl = archiveId;
    const aparanTag = cleanString(cand['Aparan Tag']);
    if (aparanTag) candidateObj.aparanTag = aparanTag;
    const sittingMLA = cleanString(cand['Sitting MLA']);
    if (sittingMLA) candidateObj.sittingMLA = sittingMLA;
    const mlaTrack = cleanString(cand['MLA Track']);
    if (mlaTrack) candidateObj.mlaTrack = mlaTrack;
    const eduTag = cleanString(cand['edu tag']);
    if (eduTag) candidateObj.eduTag = eduTag;
    const ballotOrder = cleanString(cand.ballotOrder);
    if (ballotOrder) candidateObj.ballotOrder = ballotOrder;

    grouped[qid].candidates.push(candidateObj);
  });

  if (fuzzyMatches.length > 0) {
    console.log('\n--- Fuzzy Matched FightIndex ---');
    fuzzyMatches.forEach(m => {
      console.log(`  ${m.district}: "${m.from}" → "${m.to}" (distance: ${m.distance})`);
    });
  }

  if (unmatchedConstNames.length > 0) {
    console.log('\n--- Unmatched Constituencies (no FightIndex) ---');
    unmatchedConstNames.forEach(m => {
      console.log(`  ${m.district}: "${m.name}"`);
    });
  }

  const sorted = Object.values(grouped).sort((a, b) => 
    parseInt(a.number) - parseInt(b.number)
  );

  sorted.forEach(row => {
    row.candidates.sort((a, b) => parseInt(a.ballotOrder || 999) - parseInt(b.ballotOrder || 999));
  });

  writeJSON('constituencies.json', sorted);
  console.log('Generated: constituencies.json');

  const csvPath = path.join(DATA_DIR, '2026-candidates.csv');
  const mtime = fs.statSync(csvPath).mtime.toISOString();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'version.json'), JSON.stringify({ timestamp: mtime }));
  console.log('Generated: version.json');
}

export default generate;
