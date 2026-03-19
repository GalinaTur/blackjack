const { execSync } = require('child_process');

execSync('node scripts/build-resources.js', { stdio: 'inherit' });
execSync('node scripts/build-audio.js', { stdio: 'inherit' });