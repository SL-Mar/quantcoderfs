import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { FaRegEnvelope } from 'react-icons/fa';
import { faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';
import Header from '../components/Header';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-gray-400 text-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
      <p className="mb-4 text-center">
        Have questions, suggestions, or feedback? Feel free to reach out to me!
      </p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Email</h2>
        <p className="font-medium">
          Send me an email at:{' '}
          <a href="mailto:smr.laignel@gmail.com" className="text-blue-600 hover:underline">
            smr.laignel@gmail.com
          </a>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Connect with Me</h2>
        <p>Follow my work on:</p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://medium.com/@sl_mar/about"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faMedium} className="text-gray-400 hover:text-blue-600" size="2x" />
          </a>
          <a
            href="https://github.com/SL-Mar"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faGithub} className="text-gray-400 hover:text-blue-600" size="2x" />
          </a>
        </div>
      </section>

      <div className="text-center mt-6">
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>

      <p className="text-sm text-gray-400 mt-8 text-center">
        &copy; {new Date().getFullYear()} SL Mar. All rights reserved.
      </p>
    </div>
  );
};

export default Contact;