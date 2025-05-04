'use client'

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faInfoCircle,
  faEnvelope,
  faCodeBranch,
  faBookOpen,
  faCog
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import ActiveModelBadge from './ActiveModelBadge'

const Header = () => {
  return (
    <header className="bg-gray-200 dark:bg-gray-800 px-4 py-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          QuantCoder FS
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Trading Strategy Generation for QuantConnect
        </p>

        {/* Navigation + LLM badge */}
        <nav className="flex justify-center items-center space-x-6">
          <Link href="/" className="text-gray-800 dark:text-gray-200 hover:underline">
            <FontAwesomeIcon icon={faHome} className="mr-1" />
            Home
          </Link>
          <Link href="/logs" className="text-gray-800 dark:text-gray-200 hover:underline">
            <FontAwesomeIcon icon={faCodeBranch} className="mr-1" />
            LLM Logs
          </Link>
          <Link href="/documentation" className="text-gray-800 dark:text-gray-200 hover:underline">
            <FontAwesomeIcon icon={faBookOpen} className="mr-1" />
            Documentation
          </Link>
          <Link href="/about" className="text-gray-800 dark:text-gray-200 hover:underline">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
            About
          </Link>
          <Link href="/contact" className="text-gray-800 dark:text-gray-200 hover:underline">
            <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
            Contact
          </Link>
          <Link href="/settings" className="text-gray-800 dark:text-gray-200 hover:underline">
            <FontAwesomeIcon icon={faCog} className="mr-1" />
            Settings
          </Link>

          {/* LLM badge */}
          <ActiveModelBadge />
        </nav>
      </div>
    </header>
  )
}

export default Header
