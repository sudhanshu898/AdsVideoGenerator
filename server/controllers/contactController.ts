import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { prisma } from '../configs/prisma.js';
import * as Sentry from '@sentry/node';

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    let userId: string | null = null;

    // Retrieve user identity if authenticated
    try {
      const auth = req.auth();
      if (auth?.userId) {
        userId = auth.userId;
      }
    } catch {
      // Guest user submission allowed
    }

    // Server-side validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Invalid email address format' });
    }

    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return res.status(400).json({ message: 'Subject is required' });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Persistent storage in PostgreSQL database
    const savedMessage = await prisma.contactMessage.create({
      data: {
        userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        status: 'pending',
      },
    });

    const targetSupportEmail = process.env.CONTACT_EMAIL || 'sudhanshu78787@gmail.com';
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    const smtpConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
    let emailSent = false;
    let emailAttempted = false;

    if (smtpConfigured) {
      emailAttempted = true;
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: Number(SMTP_PORT) || 587,
          secure: Number(SMTP_PORT) === 465,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"AdGenix Support" <${SMTP_USER}>`,
          to: targetSupportEmail,
          replyTo: email.trim(),
          subject: `[AdGenix Contact] ${subject.trim()}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #4f39f6;">New Customer Contact Inquiry</h2>
              <p><strong>Name:</strong> ${name.trim()}</p>
              <p><strong>Email:</strong> ${email.trim()}</p>
              <p><strong>Subject:</strong> ${subject.trim()}</p>
              <p><strong>Authenticated User ID:</strong> ${userId || 'Guest'}</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <h3>Message Content:</h3>
              <p style="background: #f9f9f9; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message.trim()}</p>
              <footer style="margin-top: 30px; font-size: 12px; color: #888;">
                Sent via AdGenix AI Customer Support System
              </footer>
            </div>
          `,
        });

        emailSent = true;
        await prisma.contactMessage.update({
          where: { id: savedMessage.id },
          data: { status: 'sent' },
        });
      } catch (emailErr: any) {
        console.warn('SMTP Email dispatch failed, message stored in database:', emailErr.message);
      }
    }

    let userMessage = 'Message received. Your request has been saved. Our support team will respond soon.';
    let statusType = 'saved_unconfigured';

    if (smtpConfigured && emailSent) {
      userMessage = 'Message sent successfully. Our support team will get back to you soon.';
      statusType = 'delivered';
    } else if (smtpConfigured && !emailSent) {
      userMessage = 'Message saved to database, but email notification could not be sent. Our team will review your inquiry shortly.';
      statusType = 'saved_email_failed';
    }

    return res.status(201).json({
      success: true,
      status: statusType,
      message: userMessage,
      contactId: savedMessage.id,
      emailSent,
      smtpConfigured,
    });
  } catch (error: any) {
    Sentry.captureException(error);
    return res.status(500).json({ message: error.message || 'Failed to process contact submission' });
  }
};
