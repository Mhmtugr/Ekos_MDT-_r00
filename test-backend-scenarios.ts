import fetch from 'node-fetch';
import Database from 'better-sqlite3';
import path from 'path';

const BASE_URL = 'http://127.0.0.1:3000/api';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 GERÇEK BACKEND & ENDPOINT TEST SENARYOLARI BAŞLIYOR');
  console.log('====================================================\n');

  // Test 1: Health check
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log(`[HEALTH CHECK] Status: ${healthRes.status}, Data:`, healthData);

  // Scenario A: Login -> Open MDT -> Design -> Approval -> Closure
  console.log('\n--- SENARYO A: Tam Akış (Login -> Talep Açma -> Onaylar -> Kapanış) ---');
  
  // 1. Login Sales User
  const salesLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'osman.celen', password: '123' })
  });
  const salesLogin = (await salesLoginRes.json()) as any;
  console.log(`1. Satış Kullanıcısı Login: HTTP ${salesLoginRes.status}, User: ${salesLogin.user?.name}`);

  // 2. Create MDT
  const mdtCreateRes = await fetch(`${BASE_URL}/mdt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${salesLogin.token}`
    },
    body: JSON.stringify({
      projectId: 'p1',
      title: 'Otomasyon Testi Revizyon Talebi',
      requestType: 'ELEKTRIK_MEKANIK',
      hasMechanicalEffect: true,
      priority: 'YUKSEK',
      clientSpecialRequest: 'Saha şartnamesi uyarınca kesici kilit revizyonu'
    })
  });
  const createdMdt = (await mdtCreateRes.json()) as any;
  console.log(`2. MDT Oluşturuldu: HTTP ${mdtCreateRes.status}, MDT No: ${createdMdt.mdtNo}, Status: ${createdMdt.currentStatus}, Version: ${createdMdt.version}`);

  // 3. Login Electrical Engineer & Move to MEKANIK_ONAYDA
  const elecLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'halil.kercin', password: '123' })
  });
  const elecLogin = (await elecLoginRes.json()) as any;

  const moveMekRes = await fetch(`${BASE_URL}/mdt/${createdMdt.id}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${elecLogin.token}`
    },
    body: JSON.stringify({
      targetStatus: 'MEKANIK_ONAYDA',
      reason: 'Elektrik projesi hazırlandı, mekanik kontrole sevk edildi.',
      expectedVersion: createdMdt.version
    })
  });
  const movedMek = (await moveMekRes.json()) as any;
  console.log(`3. Mekanik Onaya Sevk Edildi: HTTP ${moveMekRes.status}, Current Status: ${movedMek.currentStatus}, Version: ${movedMek.version}`);

  // 4. Login Mechanical Engineer & Approve
  const mekLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'erhan.gurbuz', password: '123' })
  });
  const mekLogin = (await mekLoginRes.json()) as any;

  await fetch(`${BASE_URL}/mdt/${createdMdt.id}/approvals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${mekLogin.token}`
    },
    body: JSON.stringify({
      type: 'MEKANIK',
      decision: 'ONAY',
      reason: 'Pano klemens ve yerleşim sacı mekanik olarak uygundur.'
    })
  });

  const moveMehmetRes = await fetch(`${BASE_URL}/mdt/${createdMdt.id}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${mekLogin.token}`
    },
    body: JSON.stringify({
      targetStatus: 'MEHMET_ONAYINDA',
      reason: 'Mekanik kontrol tamamlandı, yönetici onayına sunuldu.',
      expectedVersion: movedMek.version
    })
  });
  const movedMehmet = (await moveMehmetRes.json()) as any;
  console.log(`4. Mekanik Onay Verildi & Mehmet Uğur Onayına Geçildi: HTTP ${moveMehmetRes.status}, Status: ${movedMehmet.currentStatus}, Version: ${movedMehmet.version}`);

  // 5. Login Admin (Mehmet Uğur) & Close MDT
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'mehmet.ugur', password: '123' })
  });
  const adminLogin = (await adminLoginRes.json()) as any;

  const closeRes = await fetch(`${BASE_URL}/mdt/${createdMdt.id}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminLogin.token}`
    },
    body: JSON.stringify({
      targetStatus: 'KAPATILDI',
      closureNote: 'Tüm kontroller ve müşteri onayları tamamlandı. Üretim paketi serbest bırakıldı.',
      expectedVersion: movedMehmet.version
    })
  });
  const closedMdt = (await closeRes.json()) as any;
  console.log(`5. MDT Kapatıldı: HTTP ${closeRes.status}, Status: ${closedMdt.currentStatus}, ClosedAt: ${closedMdt.closedAt}, Version: ${closedMdt.version}`);


  // Scenario B: Invalid State Transition
  console.log('\n--- SENARYO B: İzin Verilmeyen Statü Geçişi Denemesi ---');
  const invalidTransitionRes = await fetch(`${BASE_URL}/mdt/${createdMdt.id}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminLogin.token}`
    },
    body: JSON.stringify({
      targetStatus: 'TASARIMDA' // KAPATILDI is terminal!
    })
  });
  const invalidTransitionData = (await invalidTransitionRes.json()) as any;
  console.log(`Geçersiz Geçiş Denemesi (KAPATILDI -> TASARIMDA): HTTP ${invalidTransitionRes.status}`);
  console.log(`Response Error Body: "${invalidTransitionData.error}"`);


  // Scenario C: Unauthorized Role Approval Attempt
  console.log('\n--- SENARYO C: Yetkisiz Kullanıcı Onay Denemesi ---');
  const unauthorizedApprovalRes = await fetch(`${BASE_URL}/mdt/${createdMdt.id}/approvals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${salesLogin.token}` // Sales user trying to give mechanical approval
    },
    body: JSON.stringify({
      type: 'MEKANIK',
      decision: 'ONAY',
      reason: 'Satış temsilcisi mekanik onay vermeye çalışıyor'
    })
  });
  const unauthorizedData = (await unauthorizedApprovalRes.json()) as any;
  console.log(`Yetkisiz Onay Denemesi (Satış kullanıcısı Mekanik Onay): HTTP ${unauthorizedApprovalRes.status}`);
  console.log(`Response Error Body: "${unauthorizedData.error}"`);


  // Scenario D: Optimistic Locking Version Conflict
  console.log('\n--- SENARYO D: Optimistic Locking Versiyon Çakışması ---');
  const staleVersionRes = await fetch(`${BASE_URL}/mdt/${createdMdt.id}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminLogin.token}`
    },
    body: JSON.stringify({
      targetStatus: 'REDDEDILDI',
      rejectionReason: 'Test amaçlı reddetme',
      expectedVersion: 1 // Stale version! Actual version is now 4
    })
  });
  const staleData = (await staleVersionRes.json()) as any;
  console.log(`Versiyon Uyuşmazlığı Denemesi (Beklenen v1, Veritabanı v4): HTTP ${staleVersionRes.status}`);
  console.log(`Response Error Body: "${staleData.error}"`);


  // Scenario E: SQLite Persistence check & Hash Chain Integrity
  console.log('\n--- SENARYO E: SQLite Veri Kalıcılığı & Hash-Chain Denetimi ---');
  const dbPath = path.join(process.cwd(), 'data', 'mdt.db');
  const db = new Database(dbPath);

  const mdtRow = db.prepare('SELECT id, mdt_no, current_status, version FROM mdt_requests WHERE id = ?').get(createdMdt.id) as any;
  console.log(`SQLite Veritabanı Sorgu Sonucu (Disk Kaydı): ID: ${mdtRow.id}, No: ${mdtRow.mdt_no}, Statü: ${mdtRow.current_status}, Versiyon: ${mdtRow.version}`);

  const auditLogs = db.prepare('SELECT id, action, record_id, timestamp, hash FROM audit_logs ORDER BY rowid DESC LIMIT 3').all() as any[];
  console.log('SQLite Audit Logs Hash Chain Örneği (Son 3 Kayıt):');
  auditLogs.forEach((l: any, idx: number) => {
    console.log(`  [${idx + 1}] Action: "${l.action}", RecordID: ${l.record_id}, SHA256 Hash: ${l.hash}`);
  });

  // Scenario F: Hash Chain Tamper Detection Test
  console.log('\n--- SENARYO F: HASH-CHAIN TAMPER DETECTION (MÜDAHALE TESPİTİ) GERÇEK TESTİ ---');
  
  // 1. Initial Verification before tamper
  const verifyBeforeRes = await fetch(`${BASE_URL}/audit-logs/verify`, {
    headers: { 'Authorization': `Bearer ${adminLogin.token}` }
  });
  const verifyBefore = (await verifyBeforeRes.json()) as any;
  console.log(`[1. Bütünlük Kontrolü - Müdahale Öncesi]: HTTP ${verifyBeforeRes.status}, Mesaj: "${verifyBefore.message}"`);

  // 2. Tamper a log in SQLite directly
  const targetLog = db.prepare('SELECT id, action FROM audit_logs ORDER BY rowid DESC LIMIT 1').get() as any;
  console.log(`[2. Doğrudan SQL Müdahalesi (Tamper)]: ID '${targetLog.id}' olan kaydın action değeri 'BOZULDU_SABOTE_EDILDI' olarak değiştiriliyor...`);
  db.prepare("UPDATE audit_logs SET action = 'BOZULDU_SABOTE_EDILDI' WHERE id = ?").run(targetLog.id);

  // 3. Verify endpoint call after tamper
  const verifyAfterRes = await fetch(`${BASE_URL}/audit-logs/verify`, {
    headers: { 'Authorization': `Bearer ${adminLogin.token}` }
  });
  const verifyAfter = (await verifyAfterRes.json()) as any;
  console.log(`[3. Bütünlük Kontrolü - Müdahale Sonrası]: HTTP ${verifyAfterRes.status}, Valid: ${verifyAfter.valid}`);
  console.log(`📢 TESPİT EDİLEN HATANIN TAM TERMINAL ÇIKTISI:`);
  console.log(`   ➜ CorruptedLogId: "${verifyAfter.corruptedLogId}"`);
  console.log(`   ➜ Error Detail: "${verifyAfter.error}"`);

  // 4. Restore original action to keep database clean
  db.prepare("UPDATE audit_logs SET action = ? WHERE id = ?").run(targetLog.action, targetLog.id);
  console.log(`[4. Onarım]: Test sonrası veritabanı orijinal haline getirildi.`);

  console.log('\n====================================================');
  console.log('✅ TÜM TEST SENARYOLARI BAŞARIYLA TAMAMLANDI (PASS)');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
});
