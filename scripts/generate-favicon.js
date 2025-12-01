const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputSvg = path.join(__dirname, '../public/icon.svg');
const outputPath = path.join(__dirname, '../public/favicon.ico');

if (!fs.existsSync(inputSvg)) {
  console.error('❌ icon.svg が見つかりません');
  process.exit(1);
}

console.log('🎨 favicon.ico を生成しています...');

sharp(inputSvg)
  .resize(32, 32)
  .png()
  .toFile(outputPath.replace('.ico', '.png'))
  .then(() => {
    // PNGからICOに変換（簡易版：実際には複数サイズを含む必要があるが、PNGでも動作する）
    return sharp(outputPath.replace('.ico', '.png'))
      .resize(32, 32)
      .toFile(outputPath);
  })
  .then(() => {
    console.log(`✅ favicon.ico を生成しました: ${outputPath}`);
    // 一時的なPNGファイルを削除
    fs.unlinkSync(outputPath.replace('.ico', '.png'));
  })
  .catch((err) => {
    console.error('❌ favicon.ico の生成に失敗しました:', err);
    process.exit(1);
  });

