import Link from 'next/link'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-900 text-primary-50 mt-24 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
          {/* Brand - Left */}
          <div className="text-left">
            <h3 className="font-heading text-lg mb-4">PORTFOLIO</h3>
          </div>

          {/* Quick Links - Center */}
          <div className="text-center md:text-center">
            <h4 className="font-subheading text-base mb-4">Quick Links</h4>
            <ul className="flex flex-col md:flex-row gap-4 md:gap-6 font-body text-sm justify-center">
              <li>
                <Link href="/" className="hover:text-accent-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-accent-500 transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent-500 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links - Right */}
          <div className="text-left md:text-right">
            <h4 className="font-subheading text-base mb-4">Connect</h4>
            <div className="flex gap-4 justify-start md:justify-end">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-500 transition-colors"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a
                href="mailto:contact@example.com"
                className="hover:text-accent-500 transition-colors"
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-700 pt-8">
          <p className="font-body text-sm text-primary-100 text-center">
            © {currentYear}
          </p>
        </div>
      </div>
    </footer>
  )
}
