import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';

@Processor('email')
export class EmailProcessor {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  @Process('new-match')
  async handleNewMatch(job: Job) {
    const { to, subject, data } = job.data;
    
    const html = `
      <h2>New Vendor Match Found!</h2>
      <p>We found a new vendor match for your project:</p>
      <ul>
        <li><strong>Project ID:</strong> ${data.projectId}</li>
        <li><strong>Vendor:</strong> ${data.vendorName}</li>
        <li><strong>Match Score:</strong> ${data.score}</li>
        <li><strong>Country:</strong> ${data.country}</li>
      </ul>
      <p>Login to your dashboard to view more details.</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  @Process('sla-warning')
  async handleSlaWarning(job: Job) {
    const { to, subject, data } = job.data;
    
    const html = `
      <h2>Vendor SLA Warning</h2>
      <p>The following vendor has exceeded their SLA response time:</p>
      <ul>
        <li><strong>Vendor:</strong> ${data.vendorName}</li>
        <li><strong>SLA Hours:</strong> ${data.slaHours}</li>
        <li><strong>Last Response:</strong> ${data.lastResponse || 'Never'}</li>
      </ul>
      <p>Please follow up with this vendor.</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
