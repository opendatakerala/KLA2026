import { computed } from 'nanostores';
import { constituencies } from './constituencyStore.js';

export const aparanStore = computed([constituencies], ($constituencies) => {
  const allCandidates = [];
  const referenceMap = new Map();

  $constituencies.forEach(constituency => {
    constituency.candidates.forEach(candidate => {
      const candInfo = {
        ...candidate,
        constituency: {
          number: constituency.number,
          name: constituency.name,
          nameMalayalam: constituency.nameMalayalam,
          district: constituency.district,
          districtMalayalam: constituency.districtMalayalam,
          qid: constituency.qid
        }
      };
      allCandidates.push(candInfo);
      if (candidate.reference) {
        referenceMap.set(candidate.reference, candInfo);
      }
    });
  });

  const candidatesWithAparanMap = new Map();
  const totalAparanCandidatesList = [];

  allCandidates.forEach(candidate => {
    if (candidate.aparanTag) {
      totalAparanCandidatesList.push(candidate);
      
      const targetRefs = candidate.aparanTag.split(',').map(s => s.trim()).filter(Boolean);
      targetRefs.forEach(ref => {
        const mainCandidate = referenceMap.get(ref);
        if (mainCandidate) {
          if (!candidatesWithAparanMap.has(ref)) {
            candidatesWithAparanMap.set(ref, {
              candidate: mainCandidate,
              constituency: mainCandidate.constituency,
              aparans: []
            });
          }
          candidatesWithAparanMap.get(ref).aparans.push(candidate);
        }
      });
    }
  });

  const allianceStats = { LDF: 0, UDF: 0, NDA: 0, Others: 0 };
  const byAlliance = { LDF: [], UDF: [], NDA: [], Others: [] };

  candidatesWithAparanMap.forEach(data => {
    const alliance = data.candidate.alliance || 'Others';
    const allianceKey = ['LDF', 'UDF', 'NDA'].includes(alliance) ? alliance : 'Others';
    
    allianceStats[allianceKey]++;
    byAlliance[allianceKey].push(data);
  });

  Object.keys(byAlliance).forEach(key => {
    byAlliance[key].sort((a, b) => b.aparans.length - a.aparans.length);
  });

  return {
    totalAparanCandidates: totalAparanCandidatesList.length,
    totalCandidatesWithAparan: candidatesWithAparanMap.size,
    allianceStats,
    byAlliance
  };
});
