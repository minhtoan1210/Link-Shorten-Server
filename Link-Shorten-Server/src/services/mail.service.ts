import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as hbs from 'hbs';
import { join } from 'path';
import { readFile } from 'fs/promises';
@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_USER?.toString(),
      pass: process.env.GOOGLE_APP_PASSWORD?.toString(),
    },
  });
  constructor() {}

  async compileTemplate(template: string, context: any): Promise<any> {
    const templatePath = join(
      process.cwd(),
      'src',
      'email_templates',
      `${template}.hbs`,
    );
    const templateFile = await readFile(templatePath, 'utf-8');

    // Compile with hbs
    const compiledTemplate = hbs.compile(templateFile);
    return compiledTemplate(context);
  }

  async sendResetCode(email: string, code: string): Promise<any> {
    const htmlContent = await this.compileTemplate('resetPasswordCode', {
      code: code,
    });
    const mailOptions = {
      from: 'GoFiber Short Link <quanhtc@gofiber.vn>',
      to: [email],
      subject: 'Reset Password Code',
      html: htmlContent,
    };

    const info = await this.transporter.sendMail(mailOptions);
    return info ? true : false;
  }
}
