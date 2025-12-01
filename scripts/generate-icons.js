const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const inputSvg = path.join(__dirname, '../public/icon.svg');
const outputDir = path.join(__dirname, '../public');

// SVGファイルの存在確認
if (!fs.existsSync(inputSvg)) {
  console.error('❌ icon.svg が見つかりません');
  process.exit(1);
}

console.log('🎨 アイコンを生成しています...\n');

// 各サイズのアイコンを生成
Promise.all(
  sizes.map((size) => {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    return sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(outputPath)
      .then(() => {
        console.log(`✅ ${size}x${size} を生成しました: ${outputPath}`);
      })
      .catch((err) => {
        console.error(`❌ ${size}x${size} の生成に失敗しました:`, err);
      });
  })
)
  .then(() => {
    console.log('\n✨ すべてのアイコンの生成が完了しました！');
  })
  .catch((err) => {
    console.error('❌ エラーが発生しました:', err);
    process.exit(1);
  });

