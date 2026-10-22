import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../../../');
const publicImagesDir = path.resolve(rootDir, 'public/images/products');
const masterCsvPath = path.resolve(rootDir, 'csv_files/products_master.csv');
const reportCsvPath = path.resolve(rootDir, 'backend/image_report.csv');

// Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// Calculate similarity score as percentage (0 to 100)
function calculateSimilarity(str1, str2) {
  const s1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const s2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s1 === s2) return 100;
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 100;
  const dist = levenshtein(s1, s2);
  return Math.round(((maxLen - dist) / maxLen) * 100);
}

function csvEscape(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('\"') || str.includes('\n')) {
    return `\"${str.replace(/\"/g, '\"\"')}\"`;
  }
  return str;
}

function runCheck() {
  console.log('[db:images:check] Starting image assets check (report-only)...');

  if (!fs.existsSync(masterCsvPath)) {
    console.error(`[db:images:check] Master CSV not found at ${masterCsvPath}. Run npm run products:generate first.`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(masterCsvPath, 'utf8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true, trim: true });

  const diskFiles = fs.existsSync(publicImagesDir) ? fs.readdirSync(publicImagesDir) : [];
  const diskFilesSet = new Set(diskFiles);

  const usedFilesSet = new Set();
  const missingProducts = []; // (a) products whose image file is missing

  for (const p of records) {
    const imgFile = p.image_file;
    if (imgFile && diskFilesSet.has(imgFile)) {
      usedFilesSet.add(imgFile);
    } else {
      missingProducts.push({
        name: p.name,
        expectedFile: imgFile || `${p.name}.jpg`,
        barcode: p.barcode,
      });
    }
  }

  // (b) image files in /public/images/products/ used by no product
  const unusedFiles = [];
  for (const f of diskFiles) {
    if (!usedFilesSet.has(f)) {
      unusedFiles.push(f);
    }
  }

  // (c) for each unused file, closest unmatched product by fuzzy matching with score > 70%
  const fuzzyMatches = [];
  for (const unusedFile of unusedFiles) {
    const fileBase = unusedFile.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    let bestMatch = null;
    let bestScore = 0;

    for (const missing of missingProducts) {
      const scoreName = calculateSimilarity(fileBase, missing.name);
      const scoreFile = calculateSimilarity(fileBase, missing.expectedFile.replace(/\.[^/.]+$/, ''));
      const score = Math.max(scoreName, scoreFile);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = missing.name;
      }
    }

    if (bestScore > 70) {
      fuzzyMatches.push({
        file: unusedFile,
        closestProduct: bestMatch,
        score: `${bestScore}%`,
      });
    }
  }

  // Generate image_report.csv
  const reportRows = [
    ['category', 'item', 'matched_target', 'score', 'details'].join(','),
  ];

  if (missingProducts.length === 0 && unusedFiles.length === 0) {
    reportRows.push([
      'ALL_VERIFIED',
      'All 50 products have matching image files',
      'N/A',
      '100%',
      `Verified ${records.length} products against ${diskFiles.length} files in public/images/products/`,
    ].join(','));
  }

  for (const m of missingProducts) {
    reportRows.push([
      'MISSING_PRODUCT_IMAGE',
      csvEscape(m.name),
      csvEscape(m.expectedFile),
      '0%',
      `Product barcode: ${m.barcode}`,
    ].join(','));
  }

  for (const u of unusedFiles) {
    const matched = fuzzyMatches.find(fm => fm.file === u);
    reportRows.push([
      'UNUSED_IMAGE_FILE',
      csvEscape(u),
      csvEscape(matched ? matched.closestProduct : 'None'),
      matched ? matched.score : 'N/A',
      matched ? `Fuzzy matched above 70% threshold` : 'No matching product above 70% threshold',
    ].join(','));
  }

  fs.writeFileSync(reportCsvPath, reportRows.join('\n') + '\n', 'utf8');

  console.log(`========================================================`);
  console.log(`[db:images:check] Image Check Summary:`);
  console.log(`  Total Products in Master: ${records.length}`);
  console.log(`  Total Images on Disk    : ${diskFiles.length}`);
  console.log(`  (a) Missing Product Imgs: ${missingProducts.length}`);
  console.log(`  (b) Unused Disk Images  : ${unusedFiles.length}`);
  console.log(`  (c) Fuzzy Matches (>70%): ${fuzzyMatches.length}`);
  console.log(`  Report successfully saved to: ${reportCsvPath}`);
  console.log(`========================================================`);
}

runCheck();
