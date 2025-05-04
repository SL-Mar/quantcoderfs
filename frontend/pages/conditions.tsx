import React from 'react';
import Link from 'next/link';

const TermsOfUse = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-gray-400">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms of Use</h1>
      <p className="mb-4">
        Welcome to <strong>QuantCoder FS</strong>. These Terms of Use govern your access and use of the platform ("Platform").
        By using the Platform, you agree to be legally bound by these terms. If you do not agree, please discontinue use.
      </p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using QuantCoder FS, you confirm that you have read, understood, and agree to comply with these Terms of Use.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. User Conduct</h2>
        <p>
          You agree to use the Platform for lawful purposes only. Prohibited activities include but are not limited to:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Unauthorized access or attempts to breach platform security.</li>
          <li>Distributing malware, spam, or malicious content.</li>
          <li>Violating applicable laws or regulations.</li>
          <li>Reverse-engineering or misusing platform code and services.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Intellectual Property</h2>
        <p>
          All content and features of QuantCoder FS, including code, graphics, and documentation, are the intellectual property
          of SL Mar or its licensors. Some components may be released under the
          {' '}
          <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Apache 2.0 License
          </a>.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Financial Disclaimer</h2>
        <p>
          QuantCoder FS is a research tool for exploring financial strategies. It does not offer financial advice or
          investment recommendations. Nothing on the Platform should be construed as an offer to buy or sell any security.
          Please refer to our <Link href="/disclaimer" className="text-blue-600 hover:underline">Disclaimer</Link> for full details.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. No Warranty</h2>
        <p>
          The Platform is provided "as is" without warranties of any kind. We do not guarantee availability, accuracy,
          or fitness for any particular purpose.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Limitation of Liability</h2>
        <p>
          SL Mar and affiliates shall not be held liable for any direct, indirect, incidental, or consequential damages
          arising from your use of the Platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">7. Changes to Terms</h2>
        <p>
          These terms may be updated from time to time. Continued use of the Platform after changes are posted
          constitutes acceptance of the updated Terms of Use.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">8. Contact</h2>
        <p>
          For any questions, feel free to reach out:
        </p>
        <p className="font-medium">
          Email: <a href="mailto:smr.laignel@gmail.com" className="text-blue-600 hover:underline">smr.laignel@gmail.com</a>
        </p>
      </section>

      <p className="text-sm text-gray-400 mt-8 text-center">
        &copy; {new Date().getFullYear()} SL Mar. All rights reserved.
      </p>
      <div className="text-center mt-4">
        <Link href="/" className="text-gray-400 hover:underline">Return to Home</Link>
      </div>
    </div>
  );
};

export default TermsOfUse;
