import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { Fingerprint, LockKeyhole } from "lucide-react";

import Navbar from "../components/Navbar";

import FingerprintScanner from "../components/FingerprintScanner";

import StatusMessage from "../components/StatusMessage";

import useAuth from "../hooks/useAuth";

const Login = () => {
    const { login } = useAuth();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        setLoading(true);

        try {
            await login({
                email,
            });

            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">

            <Navbar />

            <main className="max-w-6xl mx-auto px-5 py-14">

                <div className="grid lg:grid-cols-2 gap-10 items-center">

                    <section>

                        <h1 className="text-4xl font-bold mb-4">
                            Welcome back
                        </h1>

                        <p className="text-slate-400 mb-8">
                            Verify your identity using an authenticator registered to your account.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="glass-panel rounded-2xl p-7 space-y-6"
                        >

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm mb-2 text-slate-300"
                                >
                                    Registered email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="Enter your registered email"
                                    autoComplete="email"
                                    className="w-full bg-slate-950 border border-blue-500/30 rounded-xl p-4 outline-none focus:border-cyan-400"
                                />
                            </div>

                            {error && (
                                <StatusMessage
                                    type="error"
                                    message={error}
                                />
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 p-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:brightness-110 transition"
                            >
                                <Fingerprint size={22} />

                                {loading
                                    ? "Verifying..."
                                    : "Login with Fingerprint"}
                            </button>

                            <div className="flex justify-center items-center gap-2 text-xs text-slate-500">
                                <LockKeyhole size={14} />

                                Secure passwordless authentication
                            </div>

                            <p className="text-center text-sm text-slate-400">
                                New user?

                                <Link
                                    to="/register"
                                    className="text-cyan-400 ml-2"
                                >
                                    Register now
                                </Link>
                            </p>

                        </form>
                    </section>

                    <section>
                        <FingerprintScanner
                            loading={loading}
                            status={
                                loading
                                    ? "Verify using your device..."
                                    : "Place your finger..."
                            }
                        />
                    </section>

                </div>
            </main>
        </div>
    );
};

export default Login;