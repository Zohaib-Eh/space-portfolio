'use client'
import { useState } from 'react'
import { PlanetDropdown } from './PlanetDropdown'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
  { label: 'Resume', href: '/resume' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
      {/* Pill */}
      <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5">
        <span className="font-serif font-bold text-sm tracking-wide">Zohaib Ehtesham.</span>
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <button
          className="md:hidden text-white/70"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          ☰
        </button>
      </div>
      <PlanetDropdown />
      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 hover:text-accent"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
