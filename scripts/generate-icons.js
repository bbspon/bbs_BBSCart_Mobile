const fs = require('fs');
const path = require('path');

// Icon sizes for different Android densities
const iconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

const sourceIcon = path.join(__dirname, '../src/assets/images/BBSCARTAppIcon.png');
const androidResPath = path.join(__dirname, '../android/app/src/main/res');

// Check if source icon exists
if (!fs.existsSync(sourceIcon)) {
  console.error('❌ Source icon not found at:', sourceIcon);
  console.log('Please ensure BBSCARTAppIcon.png exists in src/assets/images/');
  process.exit(1);
}

console.log('📱 Android App Icon Generator');
console.log('============================\n');
console.log('⚠️  This script requires an image processing library.');
console.log('\nTo generate icons, you have two options:\n');
console.log('Option 1: Use an online tool');
console.log('  1. Go to https://icon.kitchen/ or https://www.appicon.co/');
console.log('  2. Upload: src/assets/images/BBSCARTAppIcon.png');
console.log('  3. Download Android icons');
console.log('  4. Extract and copy ic_launcher.png and ic_launcher_round.png to:');
Object.keys(iconSizes).forEach(folder => {
  console.log(`     - android/app/src/main/res/${folder}/`);
});
console.log('\nOption 2: Install sharp and run this script');
console.log('  1. Run: npm install --save-dev sharp');
console.log('  2. Run: node scripts/generate-icons.js\n');

// Try to use sharp if available
try {
  const sharp = require('sharp');
  
  console.log('✅ Sharp found! Generating icons...\n');
  
  // Read source image
  const sourceBuffer = fs.readFileSync(sourceIcon);
  
  // Generate icons for each density (using Promise.all for proper async handling)
  const generateIcons = async () => {
    const promises = Object.entries(iconSizes).map(async ([folder, size]) => {
      const folderPath = path.join(androidResPath, folder);
      
      // Ensure folder exists
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      
      try {
        // Generate square icon
        await sharp(sourceBuffer)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .png()
          .toFile(path.join(folderPath, 'ic_launcher.png'));
        
        // Generate round icon (same as square for now)
        await sharp(sourceBuffer)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .png()
          .toFile(path.join(folderPath, 'ic_launcher_round.png'));
        
        console.log(`✅ Generated icons for ${folder} (${size}x${size})`);
        return true;
      } catch (err) {
        console.error(`❌ Error generating icons for ${folder}:`, err.message);
        return false;
      }
    });
    
    await Promise.all(promises);
    console.log('\n✅ All icons generated successfully!');
    console.log('📦 Rebuild your app to see the new icon.');
    console.log('   Run: cd android && gradlew clean && cd .. && npm run android');
  };
  
  generateIcons().catch(err => {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
  });
  
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    // Sharp not installed, show instructions
    console.log('\n💡 To install sharp, run:');
    console.log('   npm install --save-dev sharp\n');
  } else {
    console.error('❌ Error:', err.message);
  }
}
