const http = require('http');

const BASE_URL = 'http://192.168.1.5:8000';

function testGetNasabah() {
  http.get(`${BASE_URL}/nasabah`, (res) => {
    console.log('GET /nasabah statusCode:', res.statusCode);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('GET /nasabah response:', data);
    });
  }).on('error', (e) => {
    console.error('Error in GET /nasabah:', e.message);
  });
}

function testPostNasabah() {
  const postData = JSON.stringify({
    id: Date.now(),
    name: 'Test User',
    address: 'Test Address',
    phone: '1234567890',
    job: 'Tester',
    idNumber: 'ID123456',
    birthPlace: 'Test City',
    birthDate: '2000-01-01',
    image: ''
  });

  const options = {
    hostname: '192.168.1.5',
    port: 8000,
    path: '/nasabah',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log('POST /nasabah statusCode:', res.statusCode);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('POST /nasabah response:', data);
    });
  });

  req.on('error', (e) => {
    console.error('Error in POST /nasabah:', e.message);
  });

  req.write(postData);
  req.end();
}

function runTests() {
  testGetNasabah();
  setTimeout(testPostNasabah, 2000);
}

runTests();
