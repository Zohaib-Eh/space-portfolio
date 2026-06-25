'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setStatus(res.ok ? 'sent' : 'error')
  }

  return (
    <section id="contact" className="relative z-10 py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4 text-center">Contact</p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-center">
          Let&apos;s talk.
        </h2>
        <p className="text-white/40 text-center mb-12 text-sm">
          zohaib.ehtesham@gmail.com
        </p>
        {status === 'sent' ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-accent text-lg"
          >
            Message sent. I&apos;ll be in touch.
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
            />
            <textarea
              placeholder="Message"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              required
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors resize-none"
            />
            {status === 'error' && (
              <p className="text-red-400 text-sm">Something went wrong — try emailing directly.</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-3 bg-accent text-bg font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ color: '#050510' }}
            >
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
        <div className="flex justify-center gap-6 mt-12 text-white/30 text-sm">
          <a href="https://github.com/Zohaib-Eh" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/zohaib-ehtesham" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">LinkedIn</a>
        </div>
        <p className="text-center text-white/20 text-xs mt-8">
          psst — there&apos;s more to discover if you explore.
        </p>
      </div>
    </section>
  )
}
