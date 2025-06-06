import React from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';

export default function TermsAndConditions() {
  return (
    <PublicLayout>
      <main className="terms-container">
        <div className="terms-content">
          <h1>Privacy Policy & Terms of Use</h1>
          <p className="last-updated">Effective Date: 19-05-2025 | Version: 1.2</p>

          <p className="terms-intro">
            This document explains how Llywellyn Labs and its associates collect, use, share, and protect your personal data on https://lsanalab.xyz/. 
            By using our Platform, you agree to the terms below.
          </p>

          <h2>Privacy Policy</h2>
          <p>
            This Privacy Policy describes how Llywellyn Labs and its associates (collectively "Llywellyn Labs", we, our, us) collect, use, share, 
            protect or otherwise process your information/personal data through our website https://lsanalab.xyz/ (referred to as "Platform"). 
            Please note that you may be able to browse certain sections of the Platform without registering with us. We do not offer any product/service 
            under this Platform outside India and your personal data will primarily be stored and processed in India.
          </p>

          <p>
            By visiting this Platform, providing your information or availing any product/service offered on the Platform, you expressly agree to be bound by the terms and 
            conditions of this Privacy Policy, the Terms of Use and the applicable service/product terms and conditions. You further agree to be governed by the laws of India, 
            including but not limited to the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal 
            Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023, as applicable to data protection and privacy. If you do not agree, please do 
            not use or access our Platform.
          </p>

          <h2>Collection</h2>
          <p>
            We collect personal data including name, date of birth, address, phone, email, payment details, biometric data (with consent), and behavioral 
            data tracked via cookies and analytics tools. You may opt not to provide some information by choosing not to use certain features.
          </p>

          <h2>Usage</h2>
          <p>
            Personal data is used to provide services, improve user experience, assist partners, resolve disputes, conduct marketing with opt-out options, 
            detect fraud, and comply with legal obligations.
          </p>

          <h2>Sharing</h2>
          <p>
            Data may be shared with internal associates, partners, service providers, government agencies (when legally required), and for legal enforcement. 
            Third-party partners' privacy policies apply when they collect data directly.
          </p>

          <h2>Security Precautions</h2>
          <p>
            We use industry-standard security measures including encryption (TLS), secure servers, and offer two-factor authentication. Despite these, 
            data transmission over the internet carries inherent risks which users accept by using the Platform.
          </p>

          <h2>Data Deletion and Retention</h2>
          <p>
            You may delete your account via your profile or by contacting us. Retention of data lasts as long as needed for service purposes or legal compliance, 
            typically no longer than 3 years unless anonymized or needed to prevent fraud.
          </p>

          <h2>Your Rights</h2>
          <p>You can access, correct, and update your personal data through Platform tools or by contacting us.</p>

          <h2>Consent</h2>
          <p>
            By using the Platform or providing data, you consent to its processing. You may manage or withdraw consent by contacting the Grievance Officer via email, 
            postal mail at Imphal address, or the contact form on our website. Withdrawal may affect service availability.
          </p>

          <h2>Changes to this Privacy Policy</h2>
          <p>We may update this Policy. Significant changes will be notified as per law. Check periodically for updates.</p>

          <h2>Contact Us</h2>
          <div className="contact-details">
            <p><strong>LLYWELLYN SANA THAOROIJAM</strong></p>
            <p>Email: <a href="mailto:contact@lsanalab.xyz" className="glow-link">contact@lsanalab.xyz</a></p>
            <p>Phone: <a href="tel:+919774226815" className="glow-link">+91-9774226815</a></p>
            <p>Address: Imphal, Manipur, 795001, India</p>
          </div>

                  <h2>Terms & Conditions</h2>
                  <ul className="terms-list">
                      <li>A. This document is an electronic record under the Information Technology Act, 2000 and related rules. It requires no physical or digital signatures.</li>
                      <li>B. Published per Rule 3(1) of the Information Technology (Intermediaries Guidelines) Rules, 2011 for the Website https://lsanalab.xyz/ and related platforms.</li>
                      <li>C. Platform owned by Llywellyn Labs, incorporated under Companies Act, 1956, registered at Imphal, Manipur.</li>
                      <li>D. Use of Platform is governed by these Terms which may change at any time.</li>
                      <li>E. "You" means any user of the Platform.</li>
                      <li>F. Using the Platform means you agree to these Terms.</li>
                      <li>
                          G. Terms of Use:
                          <div className="sublist">
                              i. Provide accurate info and be responsible for your account<br />
                              ii. No warranty on accuracy or suitability of content<br />
                              iii. Use services at your own risk; we are not liable<br />
                              iv. Content is proprietary; you have no rights to it<br />
                              v. Unauthorized use may lead to legal action<br />
                              vi. Pay applicable charges<br />
                              vii. Use only for lawful purposes<br />
                              viii. Links to third parties governed by their terms<br />
                              ix. Transactions create legally binding agreements<br />
                              x. Indemnify Llywellyn Labs from claims due to your actions<br />
                              xi. Liability capped at ₹100 or amount paid<br />
                              xii. Not liable for force majeure<br />
                              xiii. Governed by Indian laws<br />
                              xiv. Disputes subject to courts in Imphal, Manipur<br />
                              xv. Contact us for concerns
                          </div>
                      </li>
                  </ul>


          <h2>Refund Policy</h2>
          <p>
            At Llywellyn Labs, all sales are final and non-refundable except in cases of duplicate payment (technical error), undelivered service as per agreement, 
            or unauthorized transactions reported within 3 days.
          </p>

          <p>
            To request a refund, email <a href="mailto:support@lsanalab.xyz" className="glow-link">support@lsanalab.xyz</a> with transaction details and reason. 
            We respond within 7 working days; approved refund(s) will be automatically credited on your original payment method within 10 business days.
          </p>

          <p>We reserve the right to deny requests not meeting criteria.</p>
        </div>
      </main>
    </PublicLayout>
  );
}
