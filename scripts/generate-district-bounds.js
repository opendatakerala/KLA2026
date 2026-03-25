import { readTopoJSON, ensureOutputDir } from './utils/common.js';
import * as topojson from 'topojson-client';
import fs from 'fs';
import path from 'path';

function generate() {
  ensureOutputDir();
  
  const topoData = readTopoJSON('kla_map.topojson');
  const geo = topojson.feature(topoData, topoData.objects.collection);
  
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
  geo.features.forEach(f => {
    let allCoords = [];
    if (f.geometry.type === 'Polygon') {
      allCoords = f.geometry.coordinates[0];
    } else if (f.geometry.type === 'MultiPolygon') {
      allCoords = f.geometry.coordinates.map(p => p[0]);
    }
    allCoords.forEach(polygon => {
      polygon.forEach(([x, y]) => {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      });
    });
  });
  
  const padding = 2;
  const rawWidth = maxX - minX;
  const rawHeight = maxY - minY;
  
  const viewWidth = 263;
  const viewHeight = 345;
  const scale = Math.min(viewWidth / rawWidth, viewHeight / rawHeight);
  
  const offsetX = padding;
  const offsetY = padding;
  const flippedMinY = 0;
  
  const toSvgCoords = (x, y) => ({
    x: (x - minX) * scale + offsetX,
    y: (maxY - y) * scale + offsetY
  });
  
  const districtBounds = {};
  
  geo.features.forEach(f => {
    const district = f.properties.District;
    if (!district) return;
    
    let dMinX = Infinity, dMaxX = -Infinity, dMinY = Infinity, dMaxY = -Infinity;
    
    let allCoords = [];
    if (f.geometry.type === 'Polygon') {
      allCoords = f.geometry.coordinates[0];
    } else if (f.geometry.type === 'MultiPolygon') {
      allCoords = f.geometry.coordinates.map(p => p[0]);
    }
    
    allCoords.forEach(polygon => {
      polygon.forEach(([x, y]) => {
        const svg = toSvgCoords(x, y);
        dMinX = Math.min(dMinX, svg.x);
        dMaxX = Math.max(dMaxX, svg.x);
        dMinY = Math.min(dMinY, svg.y);
        dMaxY = Math.max(dMaxY, svg.y);
      });
    });
    
    const districtUpper = district.toUpperCase();
    if (!districtBounds[districtUpper]) {
      districtBounds[districtUpper] = { minX: dMinX, minY: dMinY, maxX: dMaxX, maxY: dMaxY };
    } else {
      districtBounds[districtUpper].minX = Math.min(districtBounds[districtUpper].minX, dMinX);
      districtBounds[districtUpper].minY = Math.min(districtBounds[districtUpper].minY, dMinY);
      districtBounds[districtUpper].maxX = Math.max(districtBounds[districtUpper].maxX, dMaxX);
      districtBounds[districtUpper].maxY = Math.max(districtBounds[districtUpper].maxY, dMaxY);
    }
  });
  
  const outputPath = path.join(process.cwd(), 'src', 'data', 'district-bounds.json');
  fs.writeFileSync(outputPath, JSON.stringify(districtBounds, null, 2));
  console.log(`Generated: ${outputPath}`);
}

export default generate;