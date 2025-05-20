// Quick script to set up the Statsig API key in .env.local
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envPath = path.join(process.cwd(), '.env.local');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if .env.local exists
const envExists = fs.existsSync(envPath);

rl.question('Enter your Statsig server API key: ', (apiKey) => {
  if (!apiKey || apiKey.trim() === '') {
    console.error('API key cannot be empty');
    rl.close();
    return;
  }
  
  let envContent = '';
  
  // If .env.local exists, read it and update/add the Statsig key
  if (envExists) {
    const existingContent = fs.readFileSync(envPath, 'utf8');
    if (existingContent.includes('STATSIG_SERVER_API_KEY=')) {
      // Replace existing key
      envContent = existingContent.replace(
        /STATSIG_SERVER_API_KEY=.*/,
        `STATSIG_SERVER_API_KEY=${apiKey}`
      );
    } else {
      // Add key to existing file
      envContent = existingContent + `\n# Statsig API Key\nSTATSIG_SERVER_API_KEY=${apiKey}\n`;
    }
  } else {
    // Create new .env.local file
    envContent = `# Statsig API Key\nSTATSIG_SERVER_API_KEY=${apiKey}\n`;
  }
  
  // Write to .env.local
  fs.writeFileSync(envPath, envContent);
  
  console.log(`Statsig server API key has been added to ${envPath}`);
  console.log('Remember to add this key to your Vercel environment variables as well!');
  
  rl.close();
}); 