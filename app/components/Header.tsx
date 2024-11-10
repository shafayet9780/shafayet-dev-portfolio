'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed w-full bg-white bg-opacity-70 backdrop-blur-md z-50 dark:bg-gray-800 dark:bg-opacity-70">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">SA</Link>
        <nav className="hidden md:flex space-x-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/projects">Projects</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>
        <button
          className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            {isOpen ? (
              <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
            ) : (
              <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
            )}
          </svg>
        </button>
      </div>
      {isOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white dark:bg-gray-800 py-4"
        >
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <NavLink href="/" onClick={() => setIsOpen(false)}>Home</NavLink>
            <NavLink href="/projects" onClick={() => setIsOpen(false)}>Projects</NavLink>
            <NavLink href="/blog" onClick={() => setIsOpen(false)}>Blog</NavLink>
            <NavLink href="/contact" onClick={() => setIsOpen(false)}>Contact</NavLink>
          </div>
        </motion.nav>
      )}
    </header>
  )
}

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link
    href={href}
    className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors duration-300"
    onClick={onClick}
  >
    {children}
  </Link>
)

export default Header