import { readCSV, writeJSON, ensureOutputDir, cleanString } from './utils/common.js';

function categorizeEducation(eduTag, education) {
  const tag = cleanString(eduTag).toLowerCase();
  const edu = cleanString(education).toLowerCase();
  
  if (!tag && !edu) return 'Unknown';
  
  if (tag === 'plus two') return 'Plus Two';
  if (tag === 'degree') return 'Graduate';
  if (tag === 'professional degree') {
    if (edu.includes('llb') || edu.includes('law')) return 'Professional (Law)';
    if (edu.includes('b.tech') || edu.includes('m.tech') || edu.includes('b.e.') || edu.includes('m.e.') || edu.includes('b.sc') || edu.includes('m.sc')) return 'Professional (Tech/Science)';
    if (edu.includes('mbbs') || edu.includes('md') || edu.includes('bds') || edu.includes('bams') || edu.includes('bhms')) return 'Professional (Medical)';
    if (edu.includes('b.com') || edu.includes('m.com') || edu.includes('bba') || edu.includes('mba') || edu.includes('ca')) return 'Professional (Commerce)';
    return 'Professional Degree';
  }
  
  if (edu.includes('post graduate') || edu.includes('ph.d') || edu.includes('doctorate') || edu.includes('m.a.') || edu.includes('m.sc') || edu.includes('m.com') || edu.includes('llm')) return 'Post-Graduate';
  if (edu.includes('b.a.') || edu.includes('b.sc') || edu.includes('b.com') || edu.includes('b.ed') || edu.includes('degree')) return 'Graduate';
  if (edu.includes('pre-degree') || edu.includes('higher secondary') || edu.includes('plus two') || edu.includes('12th')) return 'Plus Two';
  if (edu.includes('sslc') || edu.includes('10th') || edu.includes('ssc')) return 'Below Plus Two';
  
  if (!tag && edu) return 'Graduate';
  
  return 'Unknown';
}

function generate() {
  ensureOutputDir();
  
  const candidates = readCSV('2026-candidates.csv');
  
  const categories = ['Unknown', 'Below Plus Two', 'Plus Two', 'Graduate', 'Professional Degree', 'Post-Graduate'];
  
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
    const category = categorizeEducation(cand['edu tag'], cand.education);
    let alliance = cand.alliance || 'Others';
    
    result.overall[category] = (result.overall[category] || 0) + 1;
    if (result.byAlliance[alliance]) {
      result.byAlliance[alliance][category] = (result.byAlliance[alliance][category] || 0) + 1;
    }
  });
  
  writeJSON('education-distribution.json', result);
  console.log('Generated: education-distribution.json');
}

export default generate;
