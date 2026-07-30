function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Software Engineer",
      review:
        "LifeOS helped me organize my work and personal life in one place.",
    },
    {
      name: "Sarah Lee",
      role: "Product Designer",
      review:
        "The AI Assistant saves me hours every week. It feels like a personal productivity coach.",
    },
    {
      name: "David Kim",
      role: "Entrepreneur",
      review:
        "Beautiful design, smart features, and everything I need in a single app.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Loved by Early Users
      </h2>

      <p className="mt-5 text-center text-gray-600 dark:text-gray-400">
        What people say about LifeOS.
      </p>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        {testimonials.map((user) => (
          <div
            key={user.name}
            className="rounded-3xl p-8 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg"
          >
            <p className="text-gray-600 dark:text-gray-400">
              "{user.review}"
            </p>

            <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h3>

            <p className="text-indigo-600">
              {user.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialsSection;