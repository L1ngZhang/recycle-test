import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();
const transporters = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SERVER_EMAIL_ADDRESS,
    pass: process.env.SERVER_EMAIL_PASSWORD,
  },
});

interface IPROPSTYPE {
  to: string;
  subject: string;
  body: string;
}

export function sendMail({ to, subject, body }: IPROPSTYPE) {
  return new Promise((resolve, reject) => {
    const transporter = transporters;
    const mailOptions = {
      from: transporter.options.from,
      to: to,
      subject: subject,
      html: body,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log(`Receipt accepted ` + info.accepted);
        console.log(`Response code ` + info.response);
        resolve(info);
      }
    });
  });
}
