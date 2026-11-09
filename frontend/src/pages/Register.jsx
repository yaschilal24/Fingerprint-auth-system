import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Fingerprint, UserPlus } from "lucide-react";

import Navbar from "../components/Navbar";
import FingerprintScanner from "../components/FingerprintScanner";
import StatusMessage from "../components/StatusMessage";

import useAuth from "../hooks/useAuth";

const Register = () => {
    const { register } = useAuth();

    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
    });

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        setLoading(true);

        try {
            setMessage(
                "Starting secure device registration..."
            );

            await register(form);

            setMessage(
                "Your authenticator has been registered successfully!"
            );

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

            <main className="max-w-6xl mx-auto px-5 py-12">

                <div className="grid lg:grid-cols-2 gap-10 items-center">

                    <div>
                        <h1 className="text-4xl font-bold mb-4">
                            Create your account
                        </h1>

                        <p className="text-slate-400 mb-8">
                            Register your device's secure authenticator to access your account without a traditional password.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="glass-panel rounded-2xl p-7 space-y-5"
                        >

                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm mb-2 text-slate-300"
                                >
                                    Full name
                                </label>

                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    minLength={2}
                                    maxLength={120}
                                    value={form.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    className="w-full bg-slate-950 border border-blue-500/30 rounded-xl p-4 outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm mb-2 text-slate-300"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    maxLength={255}
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
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

                            {message && (
                                <StatusMessage
                                    type="success"
                                    message={message}
                                />
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:brightness-110 transition"
                            >
                                <UserPlus size={20} />

                                {loading
                                    ? "Registering..."
                                    : "Register with Fingerprint"}
                            </button>

                            <p className="text-center text-sm text-slate-400">
                                Already registered?

                                <Link
                                    to="/login"
                                    className="text-cyan-400 ml-2"
                                >
                                    Login here
                                </Link>
                            </p>
                        </form>
                    </div>

                    <div className="space-y-5">

                        <FingerprintScanner
                            loading={loading}
                            status={
                                loading
                                    ? "Complete verification on your device..."
                                    : "Ready for secure registration"
                            }
                        />

                        <div className="text-center text-xs text-slate-500">
                            Your biometric data stays protected by your device.
                            We store only your public WebAuthn credential.
                        </div>

                    </div>

                </div>

            </main>
        </div>
    );
};

export default Register;