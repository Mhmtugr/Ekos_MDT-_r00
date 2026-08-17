import { MDTStatus } from '../../src/types';

// Strict state transition rules
export const VALID_TRANSITIONS: Record<MDTStatus, MDTStatus[]> = {
  YENI: ['TASARIMDA', 'REDDEDILDI'],
  TASARIMDA: ['MEKANIK_ONAYDA', 'MEHMET_ONAYINDA', 'REDDEDILDI'],
  MEKANIK_ONAYDA: ['MEHMET_ONAYINDA', 'REVIZYON_ISTENDI', 'REDDEDILDI'],
  MEHMET_ONAYINDA: ['UST_ONAYDA', 'MUSTERI_ONAYINDA', 'KAPATILDI', 'REVIZYON_ISTENDI', 'REDDEDILDI'],
  UST_ONAYDA: ['MUSTERI_ONAYINDA', 'KAPATILDI', 'REVIZYON_ISTENDI', 'REDDEDILDI'],
  MUSTERI_ONAYINDA: ['KAPATILDI', 'REVIZYON_ISTENDI', 'REDDEDILDI'],
  REVIZYON_ISTENDI: ['TASARIMDA', 'REDDEDILDI'],
  KAPATILDI: [],   // Terminal state
  REDDEDILDI: []    // Terminal state
};

export function validateStateTransition(
  currentStatus: MDTStatus,
  targetStatus: MDTStatus,
  options?: { closureNote?: string; rejectionReason?: string; reason?: string }
): { valid: boolean; error?: string } {
  if (currentStatus === targetStatus) {
    return { valid: true };
  }

  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    return {
      valid: false,
      error: `Geçersiz statü geçişi: '${currentStatus}' statüsünden '${targetStatus}' statüsüne geçişe izin verilmiyor. İzin verilen geçişler: [${allowed.join(', ')}]`
    };
  }

  // Mandatory DB constraint checks for closing or rejecting
  if (targetStatus === 'KAPATILDI') {
    const note = options?.closureNote || options?.reason;
    if (!note || note.trim().length === 0) {
      return {
        valid: false,
        error: "Kapatma işleminde kapatma notu (closureNote) girmek zorunludur."
      };
    }
  }

  if (targetStatus === 'REDDEDILDI' || targetStatus === 'REVIZYON_ISTENDI') {
    const reason = options?.rejectionReason || options?.reason;
    if (!reason || reason.trim().length === 0) {
      return {
        valid: false,
        error: `${targetStatus} işleminde gerekçe (rejectionReason) girmek zorunludur.`
      };
    }
  }

  return { valid: true };
}
