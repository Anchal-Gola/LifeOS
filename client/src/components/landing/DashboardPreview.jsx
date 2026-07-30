function DashboardPreview() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-24">
      <div className="rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-10">

        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Preview
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Your future workspace
            </p>
          </div>

          <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-5 py-3 rounded-xl font-semibold">
            Productivity +42%
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="rounded-2xl p-8 border border-gray-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 shadow-lg hover:scale-105 transition">

            <div className="text-4xl">📝</div>

            <h3 className="text-4xl font-bold mt-6 text-gray-900 dark:text-white">
              12
            </h3>

            <p className="text-gray-500 dark:text-gray-400">
              Pending Tasks
            </p>
          </div>

          <div className="rounded-2xl p-8 border border-gray-200 dark:border-slate-700 bg-gradient-to-br from-green-50 to-white dark:from-slate-800 dark:to-slate-900 shadow-lg hover:scale-105 transition">

            <div className="text-4xl">✅</div>

            <h3 className="text-4xl font-bold mt-6 text-gray-900 dark:text-white">
              5 / 6

            </h3>

            <p className="text-gray-500 dark:text-gray-400">
              Habits Completed
            </p>
          </div>

          <div className="rounded-2xl p-8 border border-gray-200 dark:border-slate-700 bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 shadow-lg hover:scale-105 transition">

            <div className="text-4xl">🤖</div>

            <h3 className="text-4xl font-bold mt-6 text-gray-900 dark:text-white">
              Ready

            </h3>

            <p className="text-gray-500 dark:text-gray-400">
              AI Assistant Online
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;