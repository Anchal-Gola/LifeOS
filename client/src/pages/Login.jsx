
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">

          {/* Left Side */}
          <div className="hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 text-white lg:flex lg:flex-col lg:justify-between">

            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl backdrop-blur">
                  ✨
                </div>

                <span className="text-2xl font-bold">
                  LifeOS
                </span>
              </div>

              <h2 className="max-w-md text-4xl font-bold leading-tight">
                Your life,
                <br />
                organized in one place.
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-purple-100">
                Manage your tasks, goals, habits, study, notes,
                calendar and productivity with one intelligent
                workspace.
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm leading-6 text-purple-100">
                "Small steps every day create remarkable results."
              </p>
            </div>

          </div>

          {/* Right Side */}
          <div className="flex items-center justify-center p-8 sm:p-12">

            <div className="w-full max-w-md">

              {/* Mobile Logo */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-lg text-white">
                  ✨
                </div>

                <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                  LifeOS
                </span>
              </div>

              <div className="mb-8">
                <p className="mb-2 text-sm font-semibold text-purple-600">
                  Welcome back
                </p>

                <h1 className="text-3xl font-bold text-slate-900">
                  Sign in to LifeOS
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Continue managing your life from one intelligent
                  workspace.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email address
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

              </form>

              <div className="mt-8 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">
                  LifeOS Intelligence
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                By continuing, you agree to use LifeOS responsibly
                and keep your account credentials secure.
              </p>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
