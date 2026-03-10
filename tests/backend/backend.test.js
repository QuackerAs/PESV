#!/usr/bin/env node

const http = require('http');

const username = 'admin';
const password = 'admin';
const credentials = Buffer.from(`${username}:${password}`).toString('base64');

console.log('Testing authentication endpoint...');
console.log('Username:', username);
console.log('Password:', password);
console.log('Base64 credentials:', credentials);
console.log('Authorization header:', `Basic ${credentials}`);
console.log('');

const options = {
  hostname: 'localhost',
  port: 8081,
  path: '/api/auth/me',
  method: 'GET',
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log('Response Status:', res.statusCode);
  console.log('Response Headers:', JSON.stringify(res.headers, null, 2));
  console.log('');
  
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Response Body:', data);
    if (res.statusCode === 200) {
      console.log('\n✓ SUCCESS: Backend authenticated the request correctly!');
      process.exit(0);
    } else {
      console.log(`\n✗ FAILED: Expected 200, got ${res.statusCode}`);
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error('✗ ERROR:', e.message);
  process.exit(1);
});

req.end();
