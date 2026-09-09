import { useNavigate } from "react-router-dom";

function ReminderPopup({ reminder, onClose }) {
  const navigate = useNavigate();

  if (!reminder) {
    return null;
  }

  const handleOpen = () => {
    onClose();
    navigate(reminder.link || "/calendar");
  };

  return (
    <div className="fixed right-5 top-5 z-[9999] w-[360px] max-w-[calc(100vw-40px)]">
      <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xl">
            🔔
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900">
              {reminder.title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {reminder.message}
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={onClose}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Dismiss
              </button>

              <button
                onClick={handleOpen}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Open
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-700"
            aria-label="Close reminder"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReminderPopup;