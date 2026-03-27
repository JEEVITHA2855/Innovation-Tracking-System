const axios = require('axios');

async function testLogin() {
  try{
    console.log('Testing login endpoint...');
    
    const response = await axios.post('http://localhost:5003/api/auth/login', {
      email: 'admin@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('User:', response.data.data.user);
    console.log('Token received:', !!response.data.data.token);
    
  } catch (error) {
    console.log('❌ Login failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data.message || error.response.data);
    } else if (error.request) {
      console.log('No response received - server might not be running');
      console.log('Request error:', error.message);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
