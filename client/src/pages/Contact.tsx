import { useState, useEffect } from 'react';
import { useUser } from '@clerk/react';
import Title from '../components/Title';
import { PrimaryButton } from '../components/Buttons';
import { Loader2Icon, MailIcon, SendIcon, CheckCircle2Icon, AlertCircleIcon, MessageSquareIcon } from 'lucide-react';
import { getApiUrl } from '../config/api';

const Contact = () => {
  const { user, isLoaded } = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    status: 'delivered' | 'saved_unconfigured' | 'saved_email_failed';
    message: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      const primaryEmail = user.primaryEmailAddress?.emailAddress || '';
      if (fullName) setName(fullName);
      if (primaryEmail) setEmail(primaryEmail);
    }
  }, [user, isLoaded]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionResult(null);
    setErrorMessage(null);

    // Form field validation
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!subject.trim()) {
      setErrorMessage('Please enter a subject line.');
      return;
    }

    if (!message.trim()) {
      setErrorMessage('Please enter your message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to submit contact inquiry.');
      }

      setSubmissionResult({
        status: data?.status || (data?.emailSent ? 'delivered' : 'saved_unconfigured'),
        message: data?.message || 'Message received. Your request has been saved. Our support team will respond soon.',
      });
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-12 mt-24">
      <div className="max-w-4xl mx-auto">
        <Title
          title="Contact & Support"
          heading="Get in Touch with AdGenix AI"
          description="Have questions, feedback, or need technical support? Contact our team directly."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {/* Info Side Panel */}
          <div className="md:col-span-1 glass-panel p-6 rounded-2xl flex flex-col justify-between border border-white/10 bg-white/3">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-violet-600/20 text-violet-400">
                  <MailIcon className="size-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Support Email</h3>
                  <p className="text-xs text-gray-400">Official AdGenix Inbox</p>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-white/5 mb-6">
                <a
                  href="mailto:sudhanshu78787@gmail.com"
                  className="text-sm font-medium text-indigo-400 hover:underline break-all"
                >
                  sudhanshu78787@gmail.com
                </a>
              </div>

              <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
                <div className="flex items-start gap-2">
                  <MessageSquareIcon className="size-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p>Fast response within 24 hours for all product & credit inquiries.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2Icon className="size-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p>Logged-in users automatically link contact requests with their account.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-400">
              AdGenix AI Support Team • 24/7 Availability
            </div>
          </div>

          {/* Form Area */}
          <div className="md:col-span-2 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 bg-slate-950/60">
            {submissionResult && submissionResult.status === 'delivered' && (
              <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 text-sm flex items-start gap-3">
                <CheckCircle2Icon className="size-5 shrink-0 mt-0.5 text-green-400" />
                <div>
                  <p className="font-medium">Message Sent Successfully!</p>
                  <p className="text-xs opacity-90 mt-1">{submissionResult.message}</p>
                </div>
              </div>
            )}

            {submissionResult && submissionResult.status === 'saved_unconfigured' && (
              <div className="mb-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm flex items-start gap-3">
                <CheckCircle2Icon className="size-5 shrink-0 mt-0.5 text-indigo-400" />
                <div>
                  <p className="font-medium">Message Received & Saved!</p>
                  <p className="text-xs opacity-90 mt-1">{submissionResult.message}</p>
                </div>
              </div>
            )}

            {submissionResult && submissionResult.status === 'saved_email_failed' && (
              <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm flex items-start gap-3">
                <AlertCircleIcon className="size-5 shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <p className="font-medium">Request Saved (Email Pending)</p>
                  <p className="text-xs opacity-90 mt-1">{submissionResult.message}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-3">
                <AlertCircleIcon className="size-5 shrink-0 mt-0.5 text-red-400" />
                <div>
                  <p className="font-medium">Form Validation Error</p>
                  <p className="text-xs opacity-90 mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-gray-300 mb-2">
                    Your Name <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full bg-white/5 rounded-xl border border-white/10 p-3.5 text-sm text-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-gray-300 mb-2">
                    Email Address <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-white/5 rounded-xl border border-white/10 p-3.5 text-sm text-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-medium text-gray-300 mb-2">
                  Subject <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="How can we help you?"
                  required
                  className="w-full bg-white/5 rounded-xl border border-white/10 p-3.5 text-sm text-white focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-medium text-gray-300 mb-2">
                  Message <span className="text-violet-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  required
                  className="w-full bg-white/5 rounded-xl border border-white/10 p-3.5 text-sm text-white focus:border-indigo-500 outline-none resize-none transition-all"
                />
              </div>

              <div className="pt-2">
                <PrimaryButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2Icon className="size-4 animate-spin" /> Sending Message...
                    </>
                  ) : (
                    <>
                      <SendIcon className="size-4" /> Send Message
                    </>
                  )}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
