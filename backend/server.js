// --- Import dependencies ---
const express = require('express');
const cors = require('cors');
const uploadModule = require('./upload-middleware');
const upload = uploadModule;
const sanitizeFilename = uploadModule.sanitizeFilename;
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

// Integrasi Google Drive Uploader
const { uploadFileToDriveBackground, uploadFileToDrive } = require('./googleDriveUploader');

// --- Config ---
const PORT = 5000;
const apiPrefix = '/api';
const DATA_FILE = path.join(__dirname, 'transactions.json');
const NASABAH_DATA_FILE = path.join(__dirname, 'nasabah.json');

// Google Drive folder untuk backup data
const GDRIVE_BACKUP_FOLDER_ID = '1-48h9wFhHps5lyhuAxr0tAup5KhyU_rG';

const allowedOrigins = [
  'http://localhost:8000',
  'http://localhost:3000',
  'http://192.168.0.158:8000',
  'http://192.168.0.158:3000',
  'http://192.168.1.5:8000',
  'http://192.168.1.6:8000',  // Added for network access
  'http://192.168.1.6:3000',  // Added for network access
  'http://192.168.1.6:5000',  // Added for network access
  'http://localhost:3001',
  'http://localhost:5000',
];

const corsOptions = {
  origin: '*', // Allow all origins explicitly
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
  credentials: false // Disable credentials for simpler CORS
};

// --- Express app setup ---
const app = express();
app.use(cors(corsOptions));

// Manual CORS headers untuk memastikan compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cache-Control,Pragma');
  res.header('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Helper functions ---
/**
 * Backup file data (nasabah.json atau transactions.json) ke Google Drive
 * @param {string} fileType - 'nasabah' atau 'transactions'
 */
async function backupDataToGoogleDrive(fileType) {
  try {
    const filePath = fileType === 'nasabah' ? NASABAH_DATA_FILE : DATA_FILE;
    const fileName = fileType === 'nasabah' ? 'nasabah.json' : 'transactions.json';
    
    console.log(`[BACKUP] Starting backup for ${fileName}...`);
    
    // Gunakan uploadFileToDriveBackground dengan folder ID dan overwrite=true untuk backup data
    const customName = `backup_${fileName}`;
    uploadFileToDriveBackground(filePath, GDRIVE_BACKUP_FOLDER_ID, customName, true); // overwrite=true dengan folder
    
    console.log(`✅ [BACKUP] ${fileName} backup initiated to Google Drive folder (with overwrite)`);
  } catch (err) {
    console.error(`❌ [BACKUP] Error backing up ${fileType}:`, err.message);
    // Tidak mengganggu operasi utama
  }
}

async function readData() {
  try {
    try { await fs.access(DATA_FILE); } catch { await fs.writeFile(DATA_FILE, JSON.stringify([])); }
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data:', err);
    return [];
  }
}

async function writeData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    
    // Auto backup ke Google Drive setelah update transactions
    await backupDataToGoogleDrive('transactions');
  } catch (err) {
    console.error('Error writing data:', err.message, err.stack);
  }
}

async function readNasabahData() {
  try {
    try { await fs.access(NASABAH_DATA_FILE); } catch { await fs.writeFile(NASABAH_DATA_FILE, JSON.stringify([])); }
    const data = await fs.readFile(NASABAH_DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading nasabah data:', err);
    return [];
  }
}

async function writeNasabahData(data) {
  try {
    await fs.writeFile(NASABAH_DATA_FILE, JSON.stringify(data, null, 2));
    console.log(`Successfully wrote to nasabah.json at path: ${NASABAH_DATA_FILE}`);
    
    // Auto backup ke Google Drive setelah update nasabah
    await backupDataToGoogleDrive('nasabah');
  } catch (err) {
    console.error('Error writing nasabah data:', err.message, err.stack);
  }
}

// --- Transaction Endpoints ---
app.get(apiPrefix + '/transactions', async (req, res) => {
  try {
    const transactions = await readData();
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.post(apiPrefix + '/transactions', async (req, res) => {
  let newTransaction = req.body;
  if (!newTransaction || !newTransaction.id) {
    return res.status(400).json({ error: 'Invalid transaction data' });
  }
  try {
    if (typeof newTransaction === 'string') {
      newTransaction = JSON.parse(newTransaction);
    }
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  // DEBUG: Log seluruh data transaksi yang diterima
  console.log('DEBUG: Data transaksi diterima:', newTransaction);
  try {
    const transactions = await readData();
    transactions.push(newTransaction);
    await writeData(transactions);
    
    // === REMOVED: DUPLICATE GDRIVE UPLOAD ===
    // Upload gambar sudah dilakukan di endpoint /api/upload
    // Tidak perlu upload lagi di sini untuk menghindari duplikasi
    console.log('� Transaction saved (image already uploaded via /api/upload)');
    
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

app.put(apiPrefix + '/transactions/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid transaction ID' });
  const updatedData = req.body;
  if (!updatedData) return res.status(400).json({ error: 'No data provided for update' });
  try {
    let transactions = await readData();
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).json({ error: 'Transaction not found' });
    transactions[index] = { ...transactions[index], ...updatedData };
    await writeData(transactions);
    res.status(200).json(transactions[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

app.delete(apiPrefix + '/transactions/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid transaction ID' });
  try {
    let transactions = await readData();
    const initialLength = transactions.length;
    transactions = transactions.filter(t => t.id !== id);
    if (transactions.length === initialLength) return res.status(404).json({ error: 'Transaction not found' });
    await writeData(transactions);
    res.status(200).json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

app.delete(apiPrefix + '/transactions', (req, res) => {
  writeData([]);
  res.status(200).json({ message: 'All transactions cleared' });
});

app.post(apiPrefix + '/transactions/bulk-delete', async (req, res) => {
  let ids = req.body.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty ids array' });
  }
  ids = ids.map(id => String(id));
  try {
    let transactions = await readData();
    const initialLength = transactions.length;
    transactions = transactions.filter(t => !ids.includes(String(t.id)));
    if (transactions.length === initialLength) {
      return res.status(404).json({ error: 'No matching transactions found to delete' });
    }
    await writeData(transactions);
    res.status(200).json({ message: 'Transactions deleted', deletedCount: initialLength - transactions.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to bulk delete transactions' });
  }
});

// --- Nasabah Endpoints ---
app.get(apiPrefix + '/nasabah', async (req, res) => {
  try {
    const nasabah = await readNasabahData();
    res.json(nasabah);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch nasabah' });
  }
});

app.post(apiPrefix + '/nasabah', async (req, res) => {
  let newNasabah = req.body;
  if (!newNasabah || !newNasabah.id) {
    return res.status(400).json({ error: 'Invalid nasabah data' });
  }
  try {
    if (typeof newNasabah === 'string') {
      newNasabah = JSON.parse(newNasabah);
    }
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  try {
    const nasabah = await readNasabahData();
    // PATCH: Cek duplikasi berdasarkan name, address, phone, idNumber
    const idx = nasabah.findIndex(n =>
      n.name === newNasabah.name &&
      n.address === newNasabah.address &&
      n.phone === newNasabah.phone &&
      n.idNumber === newNasabah.idNumber
    );
    if (idx !== -1) {
      // Jika sudah ada, update array images saja (gabungkan unik)
      const oldImages = Array.isArray(nasabah[idx].images) ? nasabah[idx].images : (nasabah[idx].image ? [nasabah[idx].image] : []);
      const newImages = Array.isArray(newNasabah.images) ? newNasabah.images : (newNasabah.image ? [newNasabah.image] : []);
      const mergedImages = Array.from(new Set([...(oldImages || []), ...(newImages || [])]));
      nasabah[idx] = { ...nasabah[idx], ...newNasabah, images: mergedImages };
      await writeNasabahData(nasabah);
      return res.status(200).json(nasabah[idx]);
    } else {
      nasabah.push(newNasabah);
      await writeNasabahData(nasabah);
      return res.status(201).json(newNasabah);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to save nasabah data' });
  }
});

app.put(apiPrefix + '/nasabah/:id', async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  if (!updatedData) return res.status(400).json({ error: 'No data provided for update' });
  try {
    const nasabah = await readNasabahData();
    const index = nasabah.findIndex(n => String(n.id) === String(id));
    if (index === -1) return res.status(404).json({ error: 'Nasabah not found' });
    nasabah[index] = { ...nasabah[index], ...updatedData };
    await writeNasabahData(nasabah);
    res.status(200).json(nasabah[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update nasabah data' });
  }
});

app.delete(apiPrefix + '/nasabah/:id', async (req, res) => {
  const id = req.params.id;
  try {
    let nasabah = await readNasabahData();
    const initialLength = nasabah.length;
    nasabah = nasabah.filter(n => String(n.id) !== String(id));
    if (nasabah.length === initialLength) {
      return res.status(404).json({ error: 'Nasabah not found' });
    }
    await writeNasabahData(nasabah);
    res.status(200).json({ message: 'Nasabah deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete nasabah' });
  }
});

app.post(apiPrefix + '/nasabah/bulk-delete', async (req, res) => {
  let ids = req.body.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty ids array' });
  }
  ids = ids.map(id => String(id));
  try {
    let nasabah = await readNasabahData();
    const initialLength = nasabah.length;
    nasabah = nasabah.filter(n => !ids.includes(String(n.id)));
    if (nasabah.length === initialLength) {
      return res.status(404).json({ error: 'No matching nasabah found to delete' });
    }
    await writeNasabahData(nasabah);
    res.status(200).json({ message: 'Nasabah deleted', deletedCount: initialLength - nasabah.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to bulk delete nasabah' });
  }
});

// --- Upload Endpoint ---
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fs = require('fs').promises;
    const path = require('path');
    const uploadsDir = path.join(__dirname, 'uploads');
    const ext = path.extname(req.file.originalname);
    let baseName = '';
    if (req.body && (req.body.name || req.body.nama)) {
      baseName = sanitizeFilename(req.body.name || req.body.nama);
    }
    if (!baseName) baseName = 'image';
    let finalName = baseName + ext;
    let finalPath = path.join(uploadsDir, finalName);

    // Helper to compare data
    function isSameData(a, b) {
      const fields = ['name','address','phone','job','idNumber','birthPlace','birthDate'];
      return fields.every(f => (a[f] || '') === (b[f] || ''));
    }

    // Check if file exists
    let counter = 1;
    let foundSameData = false;
    let dataList = [];
    // Check both transactions and nasabah
    try {
      const tData = JSON.parse(await fs.readFile(path.join(__dirname, 'transactions.json'), 'utf-8'));
      const nData = JSON.parse(await fs.readFile(path.join(__dirname, 'nasabah.json'), 'utf-8'));
      dataList = tData.concat(nData);
    } catch (err) {
      console.error('Error reading data files:', err);
    }

    while (true) {
      if (await fs.stat(finalPath).then(() => true).catch(() => false)) {
        // File exists, check if data is the same
        const match = dataList.find(d => {
          // Check if data fields match
          if (!isSameData(d, req.body)) return false;
          
          // Check image field (single)
          if (d.image && d.image.endsWith('/' + finalName)) return true;
          
          // Check images array (multiple)
          if (d.images && Array.isArray(d.images)) {
            return d.images.some(img => img && img.endsWith('/' + finalName));
          }
          
          return false;
        });
        
        if (match) {
          foundSameData = true;
          console.log(`[UPLOAD] 🔍 Found existing data match for: ${finalName}`);
          break;
        } else {
          // Try next suffix
          finalName = baseName + ' ' + counter + ext;
          finalPath = path.join(uploadsDir, finalName);
          counter++;
        }
      } else {
        break;
      }
    }

    // Move/rename file if needed
    const oldPath = path.join(uploadsDir, req.file.filename);
    if (foundSameData) {
      // Remove temp file, reuse existing image
      await fs.unlink(oldPath);
      console.log(`[UPLOAD] ✅ Reused existing image: ${finalName} (TIDAK UPLOAD KE GDRIVE - sudah ada di backend)`);
    } else {
      await fs.rename(oldPath, finalPath);
      console.log(`[UPLOAD] Saved new image: ${finalName} at ${finalPath}`);
      
      // Auto upload ke Google Drive di background (non-blocking) - hanya gambar baru
      try {
        // Gunakan nama file yang sama (dengan spasi) untuk lokal dan Google Drive
        const customName = finalName; // Nama file sama untuk konsistensi
        console.log(`[GDRIVE] Starting background upload for NEW image: ${finalName}`);
        uploadFileToDriveBackground(finalPath, GDRIVE_BACKUP_FOLDER_ID, customName); // Upload ke folder yang ditentukan
      } catch (gdriveErr) {
        console.error('❌ [GDRIVE] Error starting background upload:', gdriveErr.message);
        // Tidak mengganggu response upload utama
      }
    }
    const imageUrl = '/uploads/' + finalName;
    res.json({ imageUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

// --- Execute AHK Endpoint ---
app.post('/api/execute-ahk', async (req, res) => {
  try {
    const { script } = req.body;
    
    if (!script) {
      return res.status(400).json({ error: 'No AHK script provided' });
    }
    
    const fs = require('fs').promises;
    const path = require('path');
    const { spawn } = require('child_process');
    
    // Create temporary AHK file
    const tempDir = path.join(__dirname, 'temp');
    const tempFile = path.join(tempDir, `script_${Date.now()}.ahk`);
    
    try {
      // Ensure temp directory exists
      await fs.mkdir(tempDir, { recursive: true });
      
      // Write script to temporary file
      await fs.writeFile(tempFile, script, 'utf-8');
      console.log(`[AHK] Script saved to: ${tempFile}`);
      
      // Execute AHK script
      const ahkExePath = 'C:\\Program Files (x86)\\AutoHotkey\\AutoHotkey.exe';
      const ahkProcess = spawn(ahkExePath, [tempFile], {
        detached: true,
        stdio: 'ignore'
      });
      
      // Don't wait for the process to complete, let it run in background
      ahkProcess.unref();
      
      console.log(`[AHK] Script executed with PID: ${ahkProcess.pid}`);
      
      // Clean up temporary file after a delay
      setTimeout(async () => {
        try {
          await fs.unlink(tempFile);
          console.log(`[AHK] Cleaned up temp file: ${tempFile}`);
        } catch (cleanupErr) {
          console.error(`[AHK] Failed to cleanup temp file: ${cleanupErr.message}`);
        }
      }, 5000); // Wait 5 seconds before cleanup
      
      res.json({
        success: true,
        message: 'AHK script executed successfully',
        pid: ahkProcess.pid,
        tempFile: tempFile
      });
      
    } catch (fileErr) {
      console.error('[AHK] File operation error:', fileErr);
      res.status(500).json({ 
        error: 'Failed to create or execute AHK script',
        details: fileErr.message 
      });
    }
    
  } catch (err) {
    console.error('[AHK] Execute error:', err);
    res.status(500).json({ 
      error: 'Failed to execute AHK script', 
      details: err.message 
    });
  }
});

// --- Backup Endpoints ---
app.post('/api/backup-data', async (req, res) => {
  try {
    const { fileType } = req.body;
    
    if (!fileType || (fileType !== 'nasabah' && fileType !== 'transactions' && fileType !== 'both')) {
      return res.status(400).json({ 
        error: 'Invalid fileType. Must be "nasabah", "transactions", or "both"' 
      });
    }
    
    console.log(`[BACKUP] Manual backup requested for: ${fileType}`);
    
    if (fileType === 'both') {
      await backupDataToGoogleDrive('nasabah');
      await backupDataToGoogleDrive('transactions');
      res.json({
        success: true,
        message: 'Manual backup initiated for both nasabah.json and transactions.json'
      });
    } else {
      await backupDataToGoogleDrive(fileType);
      res.json({
        success: true,
        message: `Manual backup initiated for ${fileType}.json`
      });
    }
    
  } catch (err) {
    console.error('[BACKUP] Manual backup error:', err);
    res.status(500).json({ 
      error: 'Failed to initiate backup', 
      details: err.message 
    });
  }
});

app.get('/api/backup-status', async (req, res) => {
  try {
    const nasabahExists = fsSync.existsSync(NASABAH_DATA_FILE);
    const transactionsExists = fsSync.existsSync(DATA_FILE);
    
    let nasabahStat = null;
    let transactionsStat = null;
    
    if (nasabahExists) {
      nasabahStat = fsSync.statSync(NASABAH_DATA_FILE);
    }
    
    if (transactionsExists) {
      transactionsStat = fsSync.statSync(DATA_FILE);
    }
    
    res.json({
      success: true,
      files: {
        nasabah: {
          exists: nasabahExists,
          path: NASABAH_DATA_FILE,
          lastModified: nasabahStat ? nasabahStat.mtime : null,
          size: nasabahStat ? nasabahStat.size : null
        },
        transactions: {
          exists: transactionsExists,
          path: DATA_FILE,
          lastModified: transactionsStat ? transactionsStat.mtime : null,
          size: transactionsStat ? transactionsStat.size : null
        }
      }
    });
    
  } catch (err) {
    console.error('[BACKUP] Status check error:', err);
    res.status(500).json({ 
      error: 'Failed to check backup status', 
      details: err.message 
    });
  }
});

// --- Root Endpoint ---
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Backend API Server</h1><p>This server provides API endpoints for Nasabah and Transactions data.</p>');
});

// --- Start Server ---
const server = app.listen(PORT, '0.0.0.0', () => {
  const os = require('os');
  const ifaces = os.networkInterfaces();
  let ips = [];
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  if (ips.length === 0) ips = ['192.168.1.2'];
  console.log(`Backend server running on (HTTP):`);
  ips.forEach(ip => console.log(`  http://${ip}:${PORT}`));
  console.log('Akses server dari perangkat lain di jaringan lokal menggunakan salah satu IP di atas.');
});
server.on('error', (err) => {
  console.error('Server listen error:', err);
});







