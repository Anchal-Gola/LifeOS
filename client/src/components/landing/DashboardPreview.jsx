function DashboardPreview() {
  return (
    <div className="mt-16 w-full max-w-5xl mx-auto rounded-2xl border shadow-xl p-8 bg-white">
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Preview</h2>
          <p className="text-gray-500">Your future workspace</p>
        </div>

        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">
          Productivity +42%
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-xl border p-6">
          <h3 className="font-semibold">Tasks</h3>
          <p className="text-gray-500 mt-2">12 Pending</p>
        </div>

        <div className="rounded-xl border p-6">
          <h3 className="font-semibold">Habits</h3>
          <p className="text-gray-500 mt-2">5/6 Completed</p>
        </div>

        <div className="rounded-xl border p-6">
          <h3 className="font-semibold">AI Assistant</h3>
          <p className="text-gray-500 mt-2">Ready to help</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPreview;