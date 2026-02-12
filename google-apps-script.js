// ============================================
// PADEL CAMP - TELEGRAM BOT & GOOGLE SHEETS
// ============================================

// Настройки Telegram бота
const TELEGRAM_BOT_TOKEN = '8181050545:AAFQKzd9ws903b4F030fOauYnNQg2VEL4r0';
const TELEGRAM_CHAT_ID = '-5208249757'; // Group chat ID

// Главная функция - принимает POST запросы с сайта
function doPost(e) {
  try {
    // Получаем данные из запроса
    const data = JSON.parse(e.postData.contents);
    const type = data.type; // Тип формы: 'camp', 'massage', 'service', 'media'

    // Обрабатываем в зависимости от типа
    if (type === 'camp') {
      handleCampRegistration(data);
    } else if (type === 'massage') {
      handleMassageBooking(data);
    } else if (type === 'service') {
      handleServiceBooking(data);
    } else if (type === 'media') {
      handleMediaPackage(data);
    }

    // Возвращаем успех
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data received'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// РЕГИСТРАЦИЯ НА КЕМП
// ============================================
function handleCampRegistration(data) {
  const sheet = getOrCreateSheet('Camp Registrations');

  // Добавляем заголовки если их нет
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Camp Type', 'Full Name', 'Phone', 'Email',
      'Level', 'Goals', 'Skills', 'T-Shirt Size'
    ]);
  }

  // Добавляем данные
  sheet.appendRow([
    new Date(),
    data.camp === '5-day' ? '5-Day Camp (€800)' : '3-Day Camp (€400)',
    data.fullName,
    data.phone,
    data.email,
    data.level,
    data.goals.join(', '),
    data.skills || '-',
    data.tshirt
  ]);

  // Отправляем в Telegram
  const campName = data.camp === '5-day' ? '5-Day Camp' : '3-Day Camp';
  const price = data.camp === '5-day' ? '€800' : '€400';

  const message = `
🎾 <b>НОВАЯ РЕГИСТРАЦИЯ НА КЕМП!</b>

🏕️ <b>Кемп:</b> ${campName} (${price})
👤 <b>Имя:</b> ${data.fullName}
📱 <b>Телефон:</b> ${data.phone}
✉️ <b>Email:</b> ${data.email}

🎯 <b>Уровень:</b> ${data.level}
👕 <b>Размер футболки:</b> ${data.tshirt}

📋 <b>Цели:</b>
${data.goals.map(g => '• ' + g).join('\n')}

${data.skills ? '💪 <b>Навыки для улучшения:</b>\n' + data.skills : ''}

⏰ ${formatDate(new Date())}
  `.trim();

  sendTelegramMessage(message);

  // Отправляем email-подтверждение клиенту
  sendConfirmationEmail(data.email, data.fullName, 'camp', data);
}

// ============================================
// БРОНИРОВАНИЕ МАССАЖА
// ============================================
function handleMassageBooking(data) {
  const sheet = getOrCreateSheet('Massage Bookings');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Duration', 'Price', 'Name', 'Phone', 'Email', 'Notes'
    ]);
  }

  sheet.appendRow([
    new Date(),
    data.duration + ' min',
    '€' + data.price,
    data.name,
    data.phone,
    data.email,
    data.notes || '-'
  ]);

  const message = `
💆 <b>НОВОЕ БРОНИРОВАНИЕ МАССАЖА!</b>

⏱️ <b>Длительность:</b> ${data.duration} минут
💰 <b>Цена:</b> €${data.price}

👤 <b>Имя:</b> ${data.name}
📱 <b>Телефон:</b> ${data.phone}
✉️ <b>Email:</b> ${data.email}

${data.notes ? '📝 <b>Заметки:</b>\n' + data.notes : ''}

⏰ ${formatDate(new Date())}
  `.trim();

  sendTelegramMessage(message);

  // Отправляем email-подтверждение клиенту
  sendConfirmationEmail(data.email, data.name, 'massage', data);
}

// ============================================
// БРОНИРОВАНИЕ ДОПОЛНИТЕЛЬНЫХ УСЛУГ
// ============================================
function handleServiceBooking(data) {
  const sheet = getOrCreateSheet('Service Bookings');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Service', 'Price', 'Name', 'Phone', 'Email', 'Notes'
    ]);
  }

  sheet.appendRow([
    new Date(),
    data.service,
    '€' + data.price,
    data.name,
    data.phone,
    data.email,
    data.notes || '-'
  ]);

  const message = `
🎓 <b>НОВОЕ БРОНИРОВАНИЕ УСЛУГИ!</b>

📦 <b>Услуга:</b> ${data.service}
💰 <b>Цена:</b> €${data.price}

👤 <b>Имя:</b> ${data.name}
📱 <b>Телефон:</b> ${data.phone}
✉️ <b>Email:</b> ${data.email}

${data.notes ? '📝 <b>Заметки:</b>\n' + data.notes : ''}

⏰ ${formatDate(new Date())}
  `.trim();

  sendTelegramMessage(message);

  // Отправляем email-подтверждение клиенту
  sendConfirmationEmail(data.email, data.name, 'service', data);
}

// ============================================
// МЕДИАПАКЕТ
// ============================================
function handleMediaPackage(data) {
  const sheet = getOrCreateSheet('Media Package');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Name', 'Phone', 'Email', 'Notes'
    ]);
  }

  sheet.appendRow([
    new Date(),
    data.name,
    data.phone,
    data.email,
    data.notes || '-'
  ]);

  const message = `
📸 <b>НОВОЕ БРОНИРОВАНИЕ МЕДИАПАКЕТА!</b>

💰 <b>Цена:</b> €130
📦 <b>Пакет:</b> 15-20 фото + видео рилс

👤 <b>Имя:</b> ${data.name}
📱 <b>Телефон:</b> ${data.phone}
✉️ <b>Email:</b> ${data.email}

${data.notes ? '📝 <b>Заметки:</b>\n' + data.notes : ''}

⏰ ${formatDate(new Date())}
  `.trim();

  sendTelegramMessage(message);

  // Отправляем email-подтверждение клиенту
  sendConfirmationEmail(data.email, data.name, 'media', data);
}

// ============================================
// EMAIL-ПОДТВЕРЖДЕНИЯ КЛИЕНТАМ
// ============================================

function sendConfirmationEmail(email, name, type, data) {
  const lang = data.lang || 'en';
  const isRu = lang === 'ru';

  const subject = getEmailSubject(type, isRu);
  const htmlBody = buildEmailHtml(name, type, data, isRu);

  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody,
      name: 'The Padel Camp Cyprus'
    });
  } catch (error) {
    Logger.log('Email error: ' + error);
  }
}

function getEmailSubject(type, isRu) {
  const subjects = {
    camp: {
      en: 'Your Padel Camp Registration Confirmed!',
      ru: 'Ваша регистрация на Padel Camp подтверждена!'
    },
    massage: {
      en: 'Your Massage Booking Confirmed!',
      ru: 'Ваше бронирование массажа подтверждено!'
    },
    service: {
      en: 'Your Booking Confirmed!',
      ru: 'Ваше бронирование подтверждено!'
    },
    media: {
      en: 'Your Media Package Booking Confirmed!',
      ru: 'Ваше бронирование медиапакета подтверждено!'
    }
  };

  return subjects[type][isRu ? 'ru' : 'en'];
}

function buildEmailHtml(name, type, data, isRu) {
  const bookingDetails = getBookingDetails(type, data, isRu);

  const t = {
    greeting: isRu ? `Здравствуйте, ${name}!` : `Hello, ${name}!`,
    thankYou: isRu
      ? 'Спасибо за бронирование! Мы получили вашу заявку.'
      : 'Thank you for your booking! We have received your request.',
    detailsTitle: isRu ? 'Детали бронирования' : 'Booking Details',
    paymentTitle: isRu ? 'Оплата' : 'Payment',
    paymentText: isRu
      ? 'Пожалуйста, подтвердите оплату через WhatsApp: <a href="https://wa.me/35797497756" style="color:#2d5f8a;font-weight:bold;">+357 97 497756</a>'
      : 'Please confirm your payment via WhatsApp: <a href="https://wa.me/35797497756" style="color:#2d5f8a;font-weight:bold;">+357 97 497756</a>',
    contactTitle: isRu ? 'Наши контакты' : 'Contact Us',
    questionsText: isRu
      ? 'Если у вас есть вопросы, свяжитесь с нами:'
      : 'If you have any questions, feel free to reach out:',
    seeYou: isRu
      ? 'Ждём вас на корте!'
      : 'See you on the court!',
    team: isRu ? 'Команда The Padel Camp' : 'The Padel Camp Team',
    footer: isRu
      ? 'Limassol, Cyprus | April 2026'
      : 'Limassol, Cyprus | April 2026'
  };

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a3a5c 0%, #2d5f8a 100%);padding:40px 30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:26px;letter-spacing:1px;">THE PADEL CAMP</h1>
              <p style="color:#7cb8e0;margin:8px 0 0;font-size:14px;letter-spacing:2px;">CYPRUS 2026</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:35px 30px;">
              <h2 style="color:#1a3a5c;margin:0 0 10px;font-size:22px;">${t.greeting}</h2>
              <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 25px;">${t.thankYou}</p>

              <!-- Booking Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:25px;">
                <tr>
                  <td style="padding:20px;">
                    <h3 style="color:#1a3a5c;margin:0 0 15px;font-size:16px;">${t.detailsTitle}</h3>
                    ${bookingDetails}
                  </td>
                </tr>
              </table>

              <!-- Payment Note -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff8e1;border-radius:8px;border:1px solid #ffe082;margin-bottom:25px;">
                <tr>
                  <td style="padding:20px;">
                    <h3 style="color:#f57f17;margin:0 0 8px;font-size:16px;">${t.paymentTitle}</h3>
                    <p style="color:#555;font-size:14px;line-height:1.6;margin:0;">${t.paymentText}</p>
                  </td>
                </tr>
              </table>

              <!-- Contact Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f7ff;border-radius:8px;border:1px solid #bbdefb;margin-bottom:25px;">
                <tr>
                  <td style="padding:20px;">
                    <h3 style="color:#1a3a5c;margin:0 0 8px;font-size:16px;">${t.contactTitle}</h3>
                    <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 10px;">${t.questionsText}</p>
                    <p style="color:#333;font-size:14px;line-height:1.8;margin:0;">
                      <strong>WhatsApp:</strong> <a href="https://wa.me/35797497756" style="color:#2d5f8a;">+357 97 497756</a><br>
                      <strong>Email:</strong> <a href="mailto:thepadelcampcy@gmail.com" style="color:#2d5f8a;">thepadelcampcy@gmail.com</a><br>
                      <strong>Web:</strong> <a href="https://thepadelcamp.com.cy" style="color:#2d5f8a;">thepadelcamp.com.cy</a>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color:#1a3a5c;font-size:16px;font-weight:bold;margin:0 0 5px;">${t.seeYou}</p>
              <p style="color:#777;font-size:14px;margin:0;">${t.team}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#1a3a5c;padding:20px 30px;text-align:center;">
              <p style="color:#7cb8e0;font-size:13px;margin:0;">${t.footer}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function getBookingDetails(type, data, isRu) {
  const row = (label, value) =>
    `<p style="color:#333;font-size:14px;margin:0 0 8px;"><strong>${label}:</strong> ${value}</p>`;

  if (type === 'camp') {
    const campName = data.camp === '5-day'
      ? (isRu ? '5-дневный интенсив (13-17 апреля)' : '5-Day Intensive Camp (April 13-17)')
      : (isRu ? '3-дневный кемп (17-19 апреля)' : '3-Day Weekend Camp (April 17-19)');
    const price = data.camp === '5-day' ? '€800' : '€400';

    return [
      row(isRu ? 'Программа' : 'Program', campName),
      row(isRu ? 'Сумма' : 'Amount', price),
      row(isRu ? 'Уровень' : 'Level', data.level),
      row(isRu ? 'Размер футболки' : 'T-Shirt Size', data.tshirt)
    ].join('');
  }

  if (type === 'massage') {
    return [
      row(isRu ? 'Массаж' : 'Massage', `${data.duration} ${isRu ? 'мин' : 'min'}`),
      row(isRu ? 'Сумма' : 'Amount', `€${data.price}`)
    ].join('');
  }

  if (type === 'service') {
    return [
      row(isRu ? 'Услуга' : 'Service', data.service),
      row(isRu ? 'Сумма' : 'Amount', `€${data.price}`)
    ].join('');
  }

  if (type === 'media') {
    return [
      row(isRu ? 'Пакет' : 'Package', isRu ? 'Медиапакет (15-20 фото + видео рилс)' : 'Media Package (15-20 photos + video reel)'),
      row(isRu ? 'Сумма' : 'Amount', '€130')
    ].join('');
  }

  return '';
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

// Получить или создать лист в таблице
function getOrCreateSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  return sheet;
}

// Отправить сообщение в Telegram
function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'HTML'
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    UrlFetchApp.fetch(url, options);
  } catch (error) {
    Logger.log('Telegram error: ' + error);
  }
}

// Форматировать дату
function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Athens'
  };

  return date.toLocaleDateString('ru-RU', options);
}

// Тестовая функция для проверки
function testTelegramBot() {
  sendTelegramMessage('🎾 <b>Тест!</b>\n\nGoogle Apps Script успешно подключен! ✅');
}
