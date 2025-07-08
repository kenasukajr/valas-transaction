const fs = require('fs');

// Test untuk menunjukkan proses input dari awal
async function showInputProcess() {
  console.log('=== PROSES INPUT DARI AWAL - PT MULIA BUMI ARTA ===\n');
  
  const baseUrl = 'http://localhost:8000';
  
  // Data lengkap yang akan diproses
  const inputData = {
    name: "PUJI PURNAWAN",
    address: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110",
    phone: "081234567890",
    job: "Software Engineer",
    idNumber: "3173051234567890",
    birthPlace: "Jakarta",
    birthDate: "1990-05-15",
    currency: "USD",
    amount: "1000",
    rate: "15750",
    rupiahEquivalent: "15750000"
  };

  console.log('📊 DATA INPUT YANG AKAN DIPROSES:');
  console.log('────────────────────────────────────');
  console.log('👤 DATA NASABAH:');
  console.log(`   • Nama Lengkap: ${inputData.name}`);
  console.log(`   • Alamat: ${inputData.address}`);
  console.log(`   • Nomor Telepon: ${inputData.phone}`);
  console.log(`   • Pekerjaan: ${inputData.job}`);
  console.log(`   • Nomor Identitas: ${inputData.idNumber}`);
  console.log(`   • Tempat Lahir: ${inputData.birthPlace}`);
  console.log(`   • Tanggal Lahir: ${inputData.birthDate}`);
  console.log('\n💱 DATA TRANSAKSI:');
  console.log(`   • Currency: ${inputData.currency}`);
  console.log(`   • Amount: ${inputData.amount}`);
  console.log(`   • Exchange Rate: ${inputData.rate}`);
  console.log(`   • Rupiah Equivalent: ${inputData.rupiahEquivalent}`);
  
  console.log('\n🔄 MULAI PROSES GENERATE SCRIPT AHK...\n');

  try {
    // Step 1: Generate script dari API
    console.log('📡 STEP 1: GENERATE SCRIPT AHK');
    console.log('────────────────────────────────');
    console.log('• Mengirim request ke API /generate-ahk');
    console.log('• Payload: Data nasabah + transaksi');
    console.log('• Expected: File script.ahk');
    
    const response = await fetch(`${baseUrl}/api/generate-ahk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const ahkContent = Buffer.from(buffer).toString('utf-8');
    
    // Simpan script yang dihasilkan
    const outputFile = 'demo-generated-script.ahk';
    fs.writeFileSync(outputFile, ahkContent);
    
    console.log('✅ Script AHK berhasil digenerate');
    console.log(`📁 File: ${outputFile}`);
    console.log(`📏 Ukuran: ${ahkContent.length} bytes`);
    
    // Step 2: Analisis struktur script
    console.log('\n🔍 STEP 2: ANALISIS STRUKTUR SCRIPT');
    console.log('────────────────────────────────────────');
    
    const lines = ahkContent.split('\n');
    console.log(`📄 Total baris: ${lines.length}`);
    
    // Deteksi komponen script
    const hasWindowCheck = ahkContent.includes('IfWinExist, Data Prosesing PT Mulia Bumi Arta');
    const hasTypeString = ahkContent.includes('TypeString(str)');
    const hasDataNasabah = ahkContent.includes('data["Nama Lengkap"]');
    const hasDataTransaksi = ahkContent.includes('Send, 1'); // USD code
    const hasNavigasi = ahkContent.includes('Send, {Tab}');
    const hasAutoDelete = ahkContent.includes('FileDelete, %A_ScriptFullPath%');
    
    console.log('🔧 Komponen Script:');
    console.log(`   • Window Detection: ${hasWindowCheck ? '✅' : '❌'}`);
    console.log(`   • TypeString Function: ${hasTypeString ? '✅' : '❌'}`);
    console.log(`   • Data Nasabah: ${hasDataNasabah ? '✅' : '❌'}`);
    console.log(`   • Data Transaksi: ${hasDataTransaksi ? '✅' : '❌'}`);
    console.log(`   • Navigasi: ${hasNavigasi ? '✅' : '❌'}`);
    console.log(`   • Auto Delete: ${hasAutoDelete ? '✅' : '❌'}`);
    
    // Step 3: Breakdown proses eksekusi
    console.log('\n⚡ STEP 3: BREAKDOWN PROSES EKSEKUSI');
    console.log('──────────────────────────────────────');
    
    // Analisis section-section dalam script
    const sections = [
      {
        name: 'Window Detection',
        pattern: /IfWinExist.*?ExitApp/s,
        description: 'Deteksi dan aktivasi window aplikasi'
      },
      {
        name: 'Initial Navigation',
        pattern: /Send, {Enter}.*?Sleep, 500/s,
        description: 'Navigasi awal ke form input'
      },
      {
        name: 'Data Preparation',
        pattern: /data := {}.*?TypeString\(str\)/s,
        description: 'Persiapan data dan fungsi helper'
      },
      {
        name: 'Nasabah Input',
        pattern: /keys := \[.*?\}/s,
        description: 'Loop pengisian 6 field nasabah'
      },
      {
        name: 'Transaction Navigation',
        pattern: /NAVIGASI KE BAGIAN TRANSAKSI.*?ISI DATA TRANSAKSI/s,
        description: 'Navigasi dari nasabah ke transaksi'
      },
      {
        name: 'Transaction Input',
        pattern: /Send, \d+.*?Sleep, 800/s,
        description: 'Pengisian 3 field transaksi'
      },
      {
        name: 'Finalization',
        pattern: /Sleep 500.*?ExitApp/s,
        description: 'Cleanup dan exit'
      }
    ];
    
    sections.forEach((section, index) => {
      const match = ahkContent.match(section.pattern);
      const found = match ? match[0].split('\n').length : 0;
      console.log(`${index + 1}. ${section.name}:`);
      console.log(`   📝 ${section.description}`);
      console.log(`   📊 ${found} baris kode`);
      console.log(`   ${found > 0 ? '✅' : '❌'} ${found > 0 ? 'Ditemukan' : 'Tidak ditemukan'}`);
    });
    
    // Step 4: Timing analysis
    console.log('\n⏱️ STEP 4: ANALISIS TIMING');
    console.log('───────────────────────────');
    
    const sleepMatches = ahkContent.match(/Sleep,?\s*(\d+)/g) || [];
    const totalSleep = sleepMatches.reduce((sum, match) => {
      const time = parseInt(match.match(/\d+/)[0]);
      return sum + time;
    }, 0);
    
    console.log(`🕒 Total Sleep Time: ${totalSleep}ms (${(totalSleep/1000).toFixed(1)}s)`);
    console.log(`🔄 Jumlah Sleep: ${sleepMatches.length} kali`);
    console.log(`⚡ Estimasi Eksekusi: ${Math.ceil(totalSleep/1000)} - ${Math.ceil(totalSleep/1000) + 5} detik`);
    
    // Step 5: Field mapping
    console.log('\n📋 STEP 5: FIELD MAPPING');
    console.log('─────────────────────────');
    
    console.log('👤 NASABAH FIELDS:');
    const nasabahFields = [
      { field: 'Nama Lengkap', value: inputData.name },
      { field: 'Alamat', value: inputData.address.substring(0, 50) + '...' },
      { field: 'Nomor Telepon', value: inputData.phone },
      { field: 'Pekerjaan', value: inputData.job },
      { field: 'Nomor Identitas', value: inputData.idNumber },
      { field: 'Tempat Tanggal Lahir', value: `${inputData.birthPlace} ${new Date(inputData.birthDate).toLocaleDateString('id-ID')}` }
    ];
    
    nasabahFields.forEach((field, index) => {
      const hasField = ahkContent.includes(`data["${field.field}"]`);
      console.log(`   ${index + 1}. ${field.field}: ${hasField ? '✅' : '❌'}`);
      console.log(`      📝 "${field.value}"`);
    });
    
    console.log('\n💱 TRANSAKSI FIELDS:');
    const currencyCode = inputData.currency === 'USD' ? '1' : 'X';
    const transaksiFields = [
      { field: 'Currency Code', value: `${currencyCode} (${inputData.currency})` },
      { field: 'Amount', value: inputData.amount },
      { field: 'Exchange Rate', value: inputData.rate }
    ];
    
    transaksiFields.forEach((field, index) => {
      let hasField = false;
      if (field.field === 'Currency Code') hasField = ahkContent.includes(`Send, ${currencyCode}`);
      else if (field.field === 'Amount') hasField = ahkContent.includes(`"${field.value}"`);
      else if (field.field === 'Exchange Rate') hasField = ahkContent.includes(`"${field.value}"`);
      
      console.log(`   ${index + 1}. ${field.field}: ${hasField ? '✅' : '❌'}`);
      console.log(`      📝 "${field.value}"`);
    });
    
    // Step 6: Preview script
    console.log('\n👀 STEP 6: PREVIEW SCRIPT (20 BARIS PERTAMA)');
    console.log('─────────────────────────────────────────────');
    
    lines.slice(0, 20).forEach((line, index) => {
      const lineNum = (index + 1).toString().padStart(2, '0');
      console.log(`${lineNum}: ${line}`);
    });
    
    if (lines.length > 20) {
      console.log(`... (${lines.length - 20} baris lainnya)`);
    }
    
    // Step 7: Validation summary
    console.log('\n✅ STEP 7: VALIDASI SUMMARY');
    console.log('────────────────────────────');
    
    const validationChecks = [
      { check: 'Window Detection', status: hasWindowCheck },
      { check: 'Data Nasabah Lengkap', status: hasDataNasabah },
      { check: 'Data Transaksi Valid', status: hasDataTransaksi },
      { check: 'Navigasi Tersedia', status: hasNavigasi },
      { check: 'Auto Delete Aktif', status: hasAutoDelete },
      { check: 'TypeString Function', status: hasTypeString }
    ];
    
    const passedChecks = validationChecks.filter(check => check.status).length;
    const totalChecks = validationChecks.length;
    
    console.log(`📊 Validasi: ${passedChecks}/${totalChecks} checks passed`);
    console.log(`📈 Success Rate: ${Math.round((passedChecks/totalChecks)*100)}%`);
    
    validationChecks.forEach(check => {
      console.log(`   ${check.status ? '✅' : '❌'} ${check.check}`);
    });
    
    // Final summary
    console.log('\n🎉 RINGKASAN PROSES INPUT');
    console.log('═══════════════════════════');
    console.log(`📁 File Generated: ${outputFile}`);
    console.log(`📏 Size: ${ahkContent.length} bytes`);
    console.log(`📄 Lines: ${lines.length}`);
    console.log(`⏱️ Est. Execution: ${Math.ceil(totalSleep/1000)} - ${Math.ceil(totalSleep/1000) + 5} detik`);
    console.log(`✅ Validation: ${passedChecks}/${totalChecks} (${Math.round((passedChecks/totalChecks)*100)}%)`);
    console.log(`🎯 Status: ${passedChecks === totalChecks ? 'READY TO USE' : 'NEEDS REVIEW'}`);
    
    if (passedChecks === totalChecks) {
      console.log('\n🚀 SCRIPT SIAP DIGUNAKAN!');
      console.log('────────────────────────────');
      console.log('1. Buka aplikasi PT Mulia Bumi Arta');
      console.log('2. Posisikan kursor di field "Nama Lengkap"');
      console.log('3. Double-click file demo-generated-script.ahk');
      console.log('4. Tunggu proses selesai (~35-40 detik)');
      console.log('5. Validasi hasil input di aplikasi');
    } else {
      console.log('\n⚠️ SCRIPT PERLU REVIEW');
      console.log('──────────────────────────');
      console.log('Beberapa komponen tidak terdeteksi dengan benar.');
      console.log('Silakan periksa script manual sebelum digunakan.');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR DALAM PROSES:', error.message);
    console.log('\n🔍 TROUBLESHOOTING:');
    console.log('1. Pastikan server backend berjalan di port 8000');
    console.log('2. Periksa endpoint /api/generate-ahk');
    console.log('3. Validasi format data input');
    console.log('4. Periksa koneksi jaringan');
  }
}

// Jalankan demo
showInputProcess().catch(console.error);
