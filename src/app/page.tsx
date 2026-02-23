'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    const children = el.querySelectorAll('.reveal');
    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function LandingPage() {
  const { dark, toggle } = useTheme();
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef} className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">

      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-gray-950/70 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            EventSpy
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors px-3 py-2"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-40 pb-28 px-6">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 hero-fade-in">
            Now in Public Beta
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] hero-fade-in hero-delay-1">
            Know exactly what
            <br />
            <span className="gradient-text">your users do.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed hero-fade-in hero-delay-2">
            Lightweight, privacy-first event tracking. One script tag gives you
            clicks, pageviews, form submissions, and real-time analytics — no
            cookie banners required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 hero-fade-in hero-delay-3">
            <Link
              href="/register"
              className="group relative inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Start Tracking Free
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-6 py-3.5 rounded-xl text-base font-medium transition-colors border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900 hover:-translate-y-0.5 transition-all duration-300"
            >
              See How It Works
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─── Social Proof ─── */}
      <section className="py-16 px-6 border-t border-gray-200 dark:border-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-8 reveal">
            Built for developers who value simplicity
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-gray-400 dark:text-gray-600 reveal">
            {['< 2kb gzipped', 'Zero cookies', 'GDPR friendly', 'Open source', 'Self-hostable'].map((item) => (
              <span key={item} className="text-sm font-medium tracking-wide">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need,
              <span className="text-indigo-600 dark:text-indigo-400"> nothing you don&apos;t.</span>
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              No bloated dashboards. No invasive tracking. Just the data that matters, presented clearly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                ),
                title: 'Click Tracking',
                desc: 'Every click captured with element tag, class, text, and position. Know exactly where users engage.',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                ),
                title: 'Real-time Analytics',
                desc: 'Live dashboard with pageviews, unique visitors, top pages, and event timelines. Updated instantly.',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                ),
                title: 'Privacy First',
                desc: 'No cookies. No fingerprinting. Visitor IDs are anonymous and stored in localStorage. GDPR compliant out of the box.',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="reveal group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-5 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24 px-6 bg-white dark:bg-gray-900/50 border-y border-gray-200 dark:border-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Three steps. Five minutes.
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              From zero to full analytics in the time it takes to make coffee.
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                step: '01',
                title: 'Create a project',
                desc: 'Sign up, name your project, and add your domain. You\'ll get a unique API key instantly.',
              },
              {
                step: '02',
                title: 'Drop in the script',
                desc: 'One script tag in your HTML. No build tools, no npm packages, no config files.',
              },
              {
                step: '03',
                title: 'Watch the data flow',
                desc: 'Events stream in real-time. Pageviews, clicks, and form submissions — all on a clean dashboard.',
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="reveal flex items-start gap-6"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-500/20">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Code Snippet ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Seriously, that&apos;s it.
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Add this to your HTML and you&apos;re tracking everything.
            </p>
          </div>

          <div className="reveal relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-950 shadow-2xl shadow-black/20">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-gray-500 font-mono">index.html</span>
            </div>
            <pre className="p-6 overflow-x-auto text-sm leading-relaxed font-mono">
              <code>
                <span className="text-gray-500">{'<!-- Add before </body> -->'}</span>
                {'\n'}
                <span className="text-pink-400">{'<'}</span>
                <span className="text-blue-400">{'script'}</span>
                {'\n'}
                {'  '}
                <span className="text-indigo-300">src</span>
                <span className="text-gray-500">=</span>
                <span className="text-green-400">{'"https://event-spy.vercel.app/sdk.js"'}</span>
                {'\n'}
                {'  '}
                <span className="text-indigo-300">data-key</span>
                <span className="text-gray-500">=</span>
                <span className="text-green-400">{'"es_your_api_key"'}</span>
                {'\n'}
                {'  '}
                <span className="text-indigo-300">defer</span>
                {'\n'}
                <span className="text-pink-400">{'>'}</span>
                <span className="text-pink-400">{'</'}</span>
                <span className="text-blue-400">{'script'}</span>
                <span className="text-pink-400">{'>'}</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-cta" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center reveal">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to see what your users
            <br />
            <span className="gradient-text">really do?</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg">
            Free to use. Takes 5 minutes. No credit card required.
          </p>
          <Link
            href="/register"
            className="glow-btn inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            Get Started for Free
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-200 dark:border-gray-800/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} EventSpy. All rights reserved.
          </span>
          <div className="flex items-center gap-6 text-sm text-gray-400 dark:text-gray-500">
            <Link href="/login" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Log in</Link>
            <Link href="/register" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>

      {/* ─── Inline Styles for animations ─── */}
      <style jsx>{`
        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Floating orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
        }
        .dark .orb { opacity: 0.15; }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #818cf8 0%, transparent 70%);
          top: -200px;
          left: -100px;
          animation: float 8s ease-in-out infinite;
        }
        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #a78bfa 0%, transparent 70%);
          top: -100px;
          right: -150px;
          animation: float 10s ease-in-out infinite reverse;
        }
        .orb-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #6366f1 0%, transparent 70%);
          bottom: -50px;
          left: 40%;
          animation: float 7s ease-in-out infinite 2s;
        }
        .orb-cta {
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, #818cf8 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: float 9s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        .orb-cta {
          animation: floatCenter 9s ease-in-out infinite;
        }
        @keyframes floatCenter {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) translateY(-30px) scale(1.05); }
        }

        /* Hero fade in */
        .hero-fade-in {
          animation: fadeUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .hero-delay-1 { animation-delay: 0.15s; }
        .hero-delay-2 { animation-delay: 0.3s; }
        .hero-delay-3 { animation-delay: 0.45s; }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Scroll reveal */
        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* Glow button */
        .glow-btn {
          position: relative;
        }
        .glow-btn::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #6366f1);
          background-size: 200% 200%;
          animation: glowPulse 3s ease-in-out infinite;
          z-index: -1;
          opacity: 0.5;
          filter: blur(12px);
        }

        @keyframes glowPulse {
          0%, 100% { background-position: 0% 50%; opacity: 0.4; }
          50% { background-position: 100% 50%; opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
