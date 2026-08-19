import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const storeFilePath = path.join(dataDir, 'mdt_store.json');
const pristineFilePath = path.join(process.cwd(), 'server', 'db', 'baseline', 'pristine_db.json');

console.log('🔄 Üretim (Production) veritabanı temiz fabrika ayarlarına döndürülüyor...');

if (!fs.existsSync(pristineFilePath)) {
  console.error('❌ HATA: Baseline dosyası bulunamadı! (server/db/baseline/pristine_db.json)');
  process.exit(1);
}

try {
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Copy pristine baseline to active store
  fs.copyFileSync(pristineFilePath, storeFilePath);
  
  console.log('✅ BAŞARILI: Veritabanı kusursuz referans (Pristine Baseline) noktasına sıfırlandı.');
  console.log(`📁 Aktif Dosya: ${storeFilePath}`);
} catch (error) {
  console.error('❌ HATA: Veritabanı sıfırlanırken bir hata oluştu:', error);
  process.exit(1);
}
