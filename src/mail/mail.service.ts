import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private config: ConfigService) {
    try {
      this.transporter = nodemailer.createTransport({
        host: 'smtppro.zoho.eu',
        port: 465,
        secure: true,
        auth: {
          user: config.get('EMAIL_USER'),
          pass: config.get('EMAIL_PASS'),
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  sendEmail(props: { to: string; subject: string; html: string }) {
    try {
      this.transporter.sendMail({
        from: this.config.get('EMAIL_USER'),
        to: props.to,
        subject: props.subject,
        html: props.html,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
