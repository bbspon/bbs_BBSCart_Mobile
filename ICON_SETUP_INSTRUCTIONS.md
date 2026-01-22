# Android App Icon Setup Instructions

## Quick Method (Recommended)

### Option 1: Using Online Tool (Easiest)

1. Go to one of these online icon generators:
   - https://icon.kitchen/ (Recommended)
   - https://www.appicon.co/
   - https://makeappicon.com/

2. Upload your icon: `src/assets/images/BBSCARTAppIcon.png`

3. Download the Android icon pack

4. Extract the downloaded zip file

5. Copy the icons to these folders:
   - `ic_launcher.png` and `ic_launcher_round.png` → `android/app/src/main/res/mipmap-mdpi/`
   - `ic_launcher.png` and `ic_launcher_round.png` → `android/app/src/main/res/mipmap-hdpi/`
   - `ic_launcher.png` and `ic_launcher_round.png` → `android/app/src/main/res/mipmap-xhdpi/`
   - `ic_launcher.png` and `ic_launcher_round.png` → `android/app/src/main/res/mipmap-xxhdpi/`
   - `ic_launcher.png` and `ic_launcher_round.png` → `android/app/src/main/res/mipmap-xxxhdpi/`

### Option 2: Using Script (Requires Node.js)

1. Install sharp (image processing library):
   ```bash
   npm install --save-dev sharp
   ```

2. Run the icon generation script:
   ```bash
   npm run generate-icons
   ```

3. The script will automatically generate all required icon sizes and place them in the correct folders.

### Option 3: Manual Replacement

If you have image editing software (Photoshop, GIMP, etc.):

1. Open `src/assets/images/BBSCARTAppIcon.png`

2. Resize and save as PNG for each density:
   - **mdpi**: 48x48 pixels → `android/app/src/main/res/mipmap-mdpi/ic_launcher.png`
   - **hdpi**: 72x72 pixels → `android/app/src/main/res/mipmap-hdpi/ic_launcher.png`
   - **xhdpi**: 96x96 pixels → `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png`
   - **xxhdpi**: 144x144 pixels → `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png`
   - **xxxhdpi**: 192x192 pixels → `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`

3. For round icons (`ic_launcher_round.png`), use the same sizes but ensure the icon is circular or has transparent corners.

## After Replacing Icons

1. Clean the build:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. Rebuild the app:
   ```bash
   npm run android
   ```

3. Or if building APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## Icon Size Reference

| Density | Folder | Size (px) |
|---------|--------|-----------|
| mdpi    | mipmap-mdpi | 48x48 |
| hdpi    | mipmap-hdpi | 72x72 |
| xhdpi   | mipmap-xhdpi | 96x96 |
| xxhdpi  | mipmap-xxhdpi | 144x144 |
| xxxhdpi | mipmap-xxxhdpi | 192x192 |

## Notes

- Icons should be square (same width and height)
- Use PNG format with transparency if needed
- The round icon (`ic_launcher_round.png`) is used on devices that support adaptive icons
- Make sure icons are high quality and not pixelated
