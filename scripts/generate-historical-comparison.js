import { readCSV, writeJSON, ensureOutputDir, parseNumber, cleanString } from './utils/common.js';

function generate() {
  ensureOutputDir();
  
  const lokSabhaData = readCSV('loksabaha.csv');
  
  const years = ['Lokasabha2014', 'Lokasabha2019', 'Lokasabha2024'];
  const yearLabels = { 'Lokasabha2014': '2014', 'Lokasabha2019': '2019', 'Lokasabha2024': '2024' };
  const result = {};
  
  years.forEach(year => {
    const yearData = lokSabhaData.filter(r => r.Event === year);
    
    const constituencyMap = {};
    
    yearData.forEach(row => {
      const acQid = cleanString(row.Qid);
      if (!acQid) return;
      
      if (!constituencyMap[acQid]) {
        constituencyMap[acQid] = {
          qid: acQid,
          candidates: [],
          totalVotesPolled: 0,
          notaVotes: 0,
          totalElectors: parseNumber(row['TOTAL ELECTORS IN PC']) || parseNumber(row['TOTAL ELECTORS'])
        };
      }
      
      const votes = parseNumber(row['VOTES SECURED EVM']);
      const nota = parseNumber(row['NOTA VOTES EVM']);
      
      if (votes !== null) {
        constituencyMap[acQid].candidates.push({
          party: cleanString(row.PARTY),
          alliance: cleanString(row.Alliances),
          votes: votes
        });
        constituencyMap[acQid].totalVotesPolled += votes;
      }
      
      if (nota !== null) {
        constituencyMap[acQid].notaVotes = nota;
      }
    });
    
    Object.values(constituencyMap).forEach(cons => {
      const totalPolled = cons.totalVotesPolled + cons.notaVotes;
      cons.candidates.forEach(cand => {
        cand.voteShare = totalPolled > 0 ? ((cand.votes / totalPolled) * 100).toFixed(2) : 0;
      });
      cons.notaShare = totalPolled > 0 ? ((cons.notaVotes / totalPolled) * 100).toFixed(2) : 0;
      cons.totalVotesPolled = totalPolled;
      
      cons.candidates.sort((a, b) => b.votes - a.votes);
    });
    
    result[year] = constituencyMap;
  });
  
  const finalResult = {
    years: {
      '2014': 'Lok Sabha 2014',
      '2019': 'Lok Sabha 2019',
      '2024': 'Lok Sabha 2024'
    },
    byConstituency: {
      'Lok Sabha 2014': result['Lokasabha2014'] || {},
      'Lok Sabha 2019': result['Lokasabha2019'] || {},
      'Lok Sabha 2024': result['Lokasabha2024'] || {}
    }
  };
  
  writeJSON('historical-comparison.json', finalResult);
  console.log('Generated: historical-comparison.json');
}

export default generate;