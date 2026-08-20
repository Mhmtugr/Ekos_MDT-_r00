import nodemailer from 'nodemailer';

// IT ekibinin sağladığı varsayılan kurumsal SMTP ayarları (Çevresel değişkenlerle de ezilebilir)
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.office365.com'; // Kurumsal adresler için en yaygın varsayılan
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || 'mdt.bildirim@ekoselectric.com';
const SMTP_PASS = process.env.SMTP_PASS || 'F.015555108149ox';
const FROM_NAME = process.env.FROM_NAME || 'MDT Bildirim (EKOS | electric)';

// Transporter yapılandırması
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // 465 ise true, diğerlerinde false (STARTTLS)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false // Geliştirme ortamı veya self-signed sertifikalar için esneklik
  }
});

export const sendNotificationEmail = async (toEmail: string, mdtNo: string, message: string) => {
  if (!toEmail) return;
  
  try {
    const mailOptions = {
      from: `"${FROM_NAME}" <${SMTP_USER}>`,
      to: toEmail,
      subject: `[EKOS MDT] Yeni Bildirim: ${mdtNo}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">EKOS MDT Bildirimi</h2>
          <p>Merhaba,</p>
          <p><strong>${mdtNo}</strong> numaralı talep ile ilgili yeni bir bildiriminiz var:</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px; font-size: 15px;">
            ${message}
          </div>
          
          <p>Detayları görüntülemek için EKOS MDT sistemine giriş yapınız.</p>
          <br/>
          <p style="font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            Bu e-posta EKOS MDT sistemi tarafından otomatik olarak oluşturulmuştur. Lütfen yanıtlamayınız.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ E-posta başarıyla gönderildi: [${mdtNo}] -> ${toEmail} (MessageId: ${info.messageId})`);
  } catch (error) {
    console.error(`❌ E-posta gönderim hatası [${toEmail}]:`, error);
  }
};
