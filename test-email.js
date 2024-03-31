const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
  host: 'smtppro.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: 'no-reply@peterbul.no',
    pass: 'tu53dgiT3RhL',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.sendMail({
  from: 'no-reply@peterbul.no',
  to: 'pc.bulukin@gmail.com',
  subject: 'Confirm your email address 2',
  html: `Test email from Peter Bulukin 2.`,
});
