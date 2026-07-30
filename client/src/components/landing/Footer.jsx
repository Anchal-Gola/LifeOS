function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-slate-700 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="flex flex-col md:flex-row justify-between items-center">

          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              LifeOS
            </h2>

            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Your AI-Powered Personal Operating System
            </p>
          </div>

          <div className="flex gap-8 mt-8 md:mt-0">
            <a href="#" className="hover:text-indigo-500 transition">
              Privacy
            </a>

            <a href="#" className="hover:text-indigo-500 transition">
              Terms
            </a>

            <a href="#" className="hover:text-indigo-500 transition">
              Contact
            </a>
          </div>

        </div>

        <div className="mt-10 border-t border-gray-200 dark:border-slate-700 pt-6 text-center text-gray-500 dark:text-gray-400">
          © 2026 LifeOS. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;