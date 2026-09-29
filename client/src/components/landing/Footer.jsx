function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#080d1c] text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-violet-600/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div>
            <h2 className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-3xl font-black tracking-tight text-transparent">
              LifeOS
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
              Your AI-Powered Personal Operating System
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-semibold text-slate-400">
            <a
              href="#features"
              className="transition-colors hover:text-violet-300"
            >
              Features
            </a>

            <a
              href="#about"
              className="transition-colors hover:text-violet-300"
            >
              About
            </a>

            <a
              href="mailto:contact@lifeos.app"
              className="transition-colors hover:text-violet-300"
            >
              Contact
            </a>

            <a
              href="#"
              className="transition-colors hover:text-violet-300"
            >
              Privacy
            </a>

            <a
              href="#"
              className="transition-colors hover:text-violet-300"
            >
              Terms
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LifeOS. All rights reserved.</p>

          <p className="font-medium text-slate-600">
            Built to bring your life into one system.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;