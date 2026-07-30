import { stats } from "../../data/landingData";
function StatsSection() {
 

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-lg hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              {stat.value}
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;