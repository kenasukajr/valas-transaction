const testData = {
  "transactionType": "BNS",
  "Nama Lengkap": "Test User",
  "Alamat": "Test Address", 
  "Nomor Telepon": "08123456789",
  "Pekerjaan": "Developer",
  "Nomor Identitas": "1234567890",
  "Tempat Tanggal Lahir": "Jakarta, 01 Jan 1990",
  "currency": "USD",
  "amount": "100000",
  "rate": "15500",
  "pembayaran": "auto"
};

fetch('/api/execute-ahk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
.then(response => response.text())
.then(script => {
  console.log('Generated AHK Script:');
  console.log(script);
  
  // Cek tidak ada function call yang invalid
  if (script.includes('CallTypeString(')) {
    console.error('ERROR: Masih ada CallTypeString function yang invalid!');
  }
  if (script.includes('TypeString("')) {
    console.error('ERROR: Masih ada TypeString function call yang invalid!');
  }
  
  // Cek format yang benar ada
  if (script.includes('TypeString_str :=') && script.includes('Gosub, TypeString')) {
    console.log('SUCCESS: Format TypeString AHK v1 sudah benar!');
  }
  
  // Write to file untuk test manual
  require('fs').writeFileSync('test-generator-output.ahk', script);
  console.log('Script saved to test-generator-output.ahk');
})
.catch(error => {
  console.error('Error:', error);
});
