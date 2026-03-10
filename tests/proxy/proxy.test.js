#!/usr/bin/env node

const http = require('http');

const username = 'admin';
const password = 'admin';
const credentials = Buffer.from(`${username}:${password}`).toString('base64');

console.log('Testing frontend proxy (port 3000)...');
console.log('Making request to: http://localhost:3000/api/auth/me');
console.log('Authorization header: Basic', credentials);
console.log('');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/me',
  method: 'GET',
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Node.js Test'
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
    console.log('');
    if (res.statusCode === 200) {
      console.log('✓ SUCCESS: Frontend proxy is working correctly!');
      process.exit(0);
    } else {
      console.log(`✗ FAILED: Expected 200, got ${res.statusCode}`);
      console.log('\nPossible issues:');
      console.log('1. setupProxy.js might not be loaded');
      console.log('2. Frontend server might not be ready');
      console.log('3. Proxy configuration might be incorrect');
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error('✗ CONNECTION ERROR:', e.message);
  console.log('\nPossible issues:');
  console.log('1. Frontend server is not running on port 3000');
  console.log('2. setupProxy.js might not be loaded');
  process.exit(1);
});

req.end();
