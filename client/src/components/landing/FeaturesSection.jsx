function FeaturesSection() {
  return (
    <section
      id="features"
      className="max-w-6xl mx-auto py-24 px-6"
    >
      <h2 className="text-4xl font-bold text-center">
        Everything You Need
      </h2>

      <p className="text-center text-gray-600 mt-4">
        One platform to organize every part of your life.
      </p>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold">📝 Smart Tasks</h3>
          <p className="mt-3 text-gray-600">
            Manage daily work with AI suggestions.
          </p>
        </div>

        <div className="border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold">📅 Calendar</h3>
          <p className="mt-3 text-gray-600">
            Plan meetings, goals and reminders.
          </p>
        </div>

        <div className="border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold">🤖 AI Assistant</h3>
          <p className="mt-3 text-gray-600">
            Ask AI to organize and improve your day.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;