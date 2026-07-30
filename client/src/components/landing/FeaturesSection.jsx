 import { features } from "../../data/landingData";
function FeaturesSection() {
  

  return (
    <section
      id="features"
      className="max-w-7xl mx-auto py-28 px-6"
    >
      <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
  Everything You Need
</h2>
      <p className="mt-5 text-center text-lg text-gray-600 dark:text-gray-400">
        One intelligent platform to organize every part of your life.
      </p>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-3xl p-8 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-5xl">
              {feature.icon}
            </div>

            <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
              {feature.title}
            </h3>

            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-7">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;