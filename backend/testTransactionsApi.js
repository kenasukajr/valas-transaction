const http = require('http');

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testApi() {
  try {
    console.log('Testing GET /transactions');
    let res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/transactions',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Status:', res.statusCode);
    console.log('Body:', res.body);

    console.log('Testing POST /transactions');
    const newTransaction = JSON.stringify({
      id: 9999,
      name: 'Test User',
      address: 'Test Address',
      phone: '1234567890',
      job: 'Tester',
      idNumber: 'ID9999',
      birthPlace: 'Test City',
      birthDate: '2000-01-01',
      image: '',
      date: '2025-06-21'
    });
    res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/transactions',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, newTransaction);
    console.log('Status:', res.statusCode);
    console.log('Body:', res.body);

    console.log('Testing DELETE /transactions/9999');
    res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/transactions/9999',
      method: 'DELETE'
    });
    console.log('Status:', res.statusCode);
    console.log('Body:', res.body);

    console.log('Testing DELETE /transactions (clear all)');
    res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/transactions',
      method: 'DELETE'
    });
    console.log('Status:', res.statusCode);
    console.log('Body:', res.body);

    console.log('Testing GET /transactions after clear');
    res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/transactions',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Status:', res.statusCode);
    console.log('Body:', res.body);

  } catch (error) {
    console.error('Error during API tests:', error);
  }
}

testApi();
