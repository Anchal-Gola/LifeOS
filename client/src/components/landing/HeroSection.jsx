function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6">
      <h1 className="text-5xl font-bold text-center">
        Your AI-Powered Personal Operating System
      </h1>

      <p className="mt-6 text-lg text-center max-w-2xl text-gray-600">
        Plan your life, manage tasks, organize notes, track habits, and let AI
        help you stay productive—all in one place.
      </p>

      <div className="mt-8 flex gap-4">
        <button className="bg-black text-white px-6 py-3 rounded-lg">
          Get Started
        </button>

        <button className="border px-6 py-3 rounded-lg">
          Learn More
        </button>
      </div>
    </section>
  );
}

export default HeroSection;