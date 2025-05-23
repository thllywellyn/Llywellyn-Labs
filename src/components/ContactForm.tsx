'use client';

import { FormEvent, useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setFormStatus({
        type: 'success',
        message: 'Message sent successfully!',
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="input-box">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          required
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          disabled={isLoading}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          required
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          disabled={isLoading}
        />
      </div>
      <div className="input-box">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={isLoading}
        />
      </div>
      <div className="input-box">
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          disabled={isLoading}
        />
      </div>
      <textarea
        name="message"
        cols={30}
        rows={10}
        placeholder="Your Message"
        required
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        disabled={isLoading}
      ></textarea>
      <button type="submit" className="btn" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Message'}
      </button>
      {formStatus.type && (
        <div
          className={`form-status ${
            formStatus.type === 'success' ? 'success' : 'error'
          }`}
        >
          {formStatus.message}
        </div>
      )}
    </form>
  );
}
