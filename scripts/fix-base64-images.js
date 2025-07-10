/**
 * Script untuk mengkonversi gambar base64 yang ada di nasabah.json menjadi file
 * dan mengganti dengan URL file path
 */
const fs = require('fs');
const path = require('path');

const NASABAH_FILE = path.resolve(__dirname, '../backend/nasabah.json');
const UPLOADS_DIR = path.resolve(__dirname, '../backend/uploads');

// Pastikan folder uploads ada
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function isBase64Image(str) {
  if (!str || typeof str !== 'string') return false;
  return str.startsWith('data:image/');
}

function convertBase64ToFile(base64String, filename) {
  try {
    // Extract MIME type and data
    const matches = base64String.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches) {
      console.log('Invalid base64 format for', filename);
      return null;
    }
    
    const extension = matches[1]; // jpeg, png, etc.
    const data = matches[2];
    
    // Generate filename
    const outputFilename = `${filename}.${extension}`;
    const outputPath = path.join(UPLOADS_DIR, outputFilename);
    
    // Convert and save
    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync(outputPath, buffer);
    
    return `/uploads/${outputFilename}`;
  } catch (error) {
    console.error('Error converting base64 to file:', error);
    return null;
  }
}

function fixNasabahImages() {
  try {
    console.log('Reading nasabah.json...');
    const data = JSON.parse(fs.readFileSync(NASABAH_FILE, 'utf-8'));
    
    let fixedCount = 0;
    
    data.forEach((nasabah, index) => {
      let hasChanges = false;
      
      // Fix main image field
      if (isBase64Image(nasabah.image)) {
        console.log(`Converting base64 image for ${nasabah.name || nasabah.id}...`);
        const filename = `nasabah_${nasabah.id || index}_main`;
        const newPath = convertBase64ToFile(nasabah.image, filename);
        if (newPath) {
          nasabah.image = newPath;
          hasChanges = true;
          fixedCount++;
        }
      }
      
      // Fix images array
      if (Array.isArray(nasabah.images)) {
        nasabah.images.forEach((img, imgIndex) => {
          if (isBase64Image(img)) {
            console.log(`Converting base64 image ${imgIndex + 1} for ${nasabah.name || nasabah.id}...`);
            const filename = `nasabah_${nasabah.id || index}_${imgIndex}`;
            const newPath = convertBase64ToFile(img, filename);
            if (newPath) {
              nasabah.images[imgIndex] = newPath;
              hasChanges = true;
              fixedCount++;
            }
          }
        });
      }
      
      if (hasChanges) {
        console.log(`Fixed images for ${nasabah.name || nasabah.id}`);
      }
    });
    
    if (fixedCount > 0) {
      // Backup original file
      const backupPath = NASABAH_FILE + '.backup.' + Date.now();
      fs.copyFileSync(NASABAH_FILE, backupPath);
      console.log(`Backup created: ${backupPath}`);
      
      // Save updated data
      fs.writeFileSync(NASABAH_FILE, JSON.stringify(data, null, 2));
      console.log(`✅ Fixed ${fixedCount} base64 images and saved to nasabah.json`);
    } else {
      console.log('✅ No base64 images found to fix');
    }
    
  } catch (error) {
    console.error('❌ Error fixing nasabah images:', error);
  }
}

// Run the fix
fixNasabahImages();
