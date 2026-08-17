import crypto from 'crypto';

export interface AuditLogItemInput {
  id: string;
  userId: string;
  userName: string;
  action: string;
  recordType: 'MDT' | 'KULLANICI' | 'PROJE' | 'SISTEM';
  recordId: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

export function computeLogHash(
  log: AuditLogItemInput,
  prevHash: string
): { prevHash: string; hash: string } {
  const payload = [
    log.id,
    log.userId,
    log.userName,
    log.action,
    log.recordType,
    log.recordId,
    log.oldValue || '',
    log.newValue || '',
    log.timestamp,
    prevHash
  ].join('|');

  const hash = crypto.createHash('sha256').update(payload).digest('hex');
  return { prevHash, hash };
}

export function verifyAuditLogChain(logs: any[]): { valid: boolean; error?: string; corruptedLogId?: string } {
  let expectedPrevHash = 'GENESIS_HASH_00000000000000000000000000000000000000000000000000000000';

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    
    // Check if prev_hash matches expected chain link
    if (log.prev_hash !== expectedPrevHash) {
      return {
        valid: false,
        corruptedLogId: log.id,
        error: `Zincir Bağlantı Hatası: Kayıt ID '${log.id}' (Sıra ${i + 1}) önceki hash '${log.prev_hash}' ile eşleşmiyor. Beklenen: '${expectedPrevHash}'`
      };
    }

    // Recompute current hash
    const { hash: computedHash } = computeLogHash(
      {
        id: log.id,
        userId: log.user_id,
        userName: log.user_name || log.userName || '',
        action: log.action,
        recordType: log.record_type,
        recordId: log.record_id,
        oldValue: log.old_value,
        newValue: log.new_value,
        timestamp: log.timestamp
      } as any,
      expectedPrevHash
    );

    if (computedHash !== log.hash) {
      return {
        valid: false,
        corruptedLogId: log.id,
        error: `Veri Bozulması / Müdahale Tespit Edildi (Tamper Detected): Kayıt ID '${log.id}' için hesaplanan hash '${computedHash}', saklanan hash '${log.hash}' ile UYUŞMUYOR!`
      };
    }

    expectedPrevHash = log.hash;
  }

  return { valid: true };
}
