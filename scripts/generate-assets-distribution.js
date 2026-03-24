import { readCSV, writeJSON, ensureOutputDir, parseNumber } from './utils/common.js';

const ASSET_BINS = [
  { label: '0-10L', min: 0, max: 1000000 },
  { label: '10L-50L', min: 1000000, max: 5000000 },
  { label: '50L-1Cr', min: 5000000, max: 10000000 },
  { label: '1Cr-5Cr', min: 10000000, max: 50000000 },
  { label: '5Cr-10Cr', min: 50000000, max: 100000000 },
  { label: '10Cr+', min: 100000000, max: Infinity }
];

function categorizeAsset(assetValue) {
  const asset = parseNumber(assetValue);
  
  if (asset === null) return 'Unknown';
  
  for (const bin of ASSET_BINS) {
    if (asset >= bin.min && asset < bin.max) {
      return bin.label;
    }
  }
  
  return '10Cr+';
}

function generate() {
  ensureOutputDir();
  
  const candidates = readCSV('2026-candidates.csv');
  
  const labels = [...ASSET_BINS.map(b => b.label), 'Unknown'];
  
  const result = {
    overall: labels.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}),
    byAlliance: {
      LDF: labels.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}),
      UDF: labels.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}),
      NDA: labels.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}),
      Others: labels.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {})
    }
  };
  
  candidates.forEach(cand => {
    const category = categorizeAsset(cand.assets);
    let alliance = cand.alliance || 'Others';
    
    result.overall[category] = (result.overall[category] || 0) + 1;
    if (result.byAlliance[alliance]) {
      result.byAlliance[alliance][category] = (result.byAlliance[alliance][category] || 0) + 1;
    }
  });
  
  writeJSON('assets-distribution.json', result);
  console.log('Generated: assets-distribution.json');
}

export default generate;