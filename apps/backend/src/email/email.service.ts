import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { InvitationEmailTemplate } from './templates/invitation-template';
import * as React from 'react';

export interface IEmailService {
  sendInvitationEmail(to: string, token: string): Promise<void>;
}

@Injectable()
export class EmailService implements IEmailService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  async sendInvitationEmail(to: string, token: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: to,
        subject: 'You have been invited!',
        react: InvitationEmailTemplate({ token }) as React.ReactElement,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      // In a real app, you'd want to handle this more gracefully
      // For example, by throwing a custom exception that can be caught by a filter
      throw new Error('Failed to send invitation email.');
    }
  }
}
