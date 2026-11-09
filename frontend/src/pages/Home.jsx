import { Link } from "react-router-dom";

import {
    Fingerprint,
    ShieldCheck,
    LockKeyhole,
    Zap,
} from "lucide-react";

import Navbar from "../components/Navbar";
import FingerprintScanner from "../components/FingerprintScanner";

const Home = () => {
    return (
        <div className="min-h-screen">

            <Navbar />

            <main className="max-w-7xl mx-auto px-5 py-16">

                <div className="grid lg:grid-cols-2 gap-14 items-center">

                    <section>

                        <div className="inline-flex items-center gap-2 border border-cyan-400/30 bg-blue-500/10 text-cyan-300 rounded-full px-4 py-2 text-sm mb-7">

                            <ShieldCheck size={17} />

                            Next Generation Authentication
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">

                            Your Identity.

                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                Your Fingerprint.
                            </span>

                            Your Security.
                        </h1>

                        <p className="text-slate-400 text-lg leading-relaxed mt-7 max-w-xl">

                            Experience secure passwordless authentication using your device's built-in biometric authenticator.

                        </p>

                        <div className="flex flex-wrap gap-4 mt-9">

                            <Link
                                to="/register"
                                className="bg-gradient-to-r from-green-500 to-emerald-600 px-7 py-4 rounded-xl font-bold text-white shadow-lg shadow-green-500/20 hover:scale-105 transition"
                            >
                                <span className="flex items-center gap-2">
                                    <Fingerprint size={20} />
                                    Register Fingerprint
                                </span>
                            </Link>

                            <Link
                                to="/login"
                                className="border border-blue-400/50 bg-blue-500/10 px-7 py-4 rounded-xl font-bold text-cyan-300 hover:bg-blue-500/20 transition"
                            >
                                Login Securely
                            </Link>

                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-12">

                            <div>
                                <ShieldCheck className="text-green-400 mb-2" />
                                <p className="text-sm font-semibold">
                                    Secure
                                </p>
                                <p className="text-xs text-slate-500">
                                    Cryptographic
                                </p>
                            </div>

                            <div>
                                <LockKeyhole className="text-cyan-400 mb-2" />
                                <p className="text-sm font-semibold">
                                    Private
                                </p>
                                <p className="text-xs text-slate-500">
                                    Device protected
                                </p>
                            </div>

                            <div>
                                <Zap className="text-yellow-400 mb-2" />
                                <p className="text-sm font-semibold">
                                    Fast
                                </p>
                                <p className="text-xs text-slate-500">
                                    Passwordless
                                </p>
                            </div>

                        </div>
                    </section>

                    <section>
                        <FingerprintScanner />
                    </section>

                </div>

            </main>

            <footer className="border-t border-blue-500/20 py-6 text-center text-slate-500 text-sm">
                © 2026 BioSecure. Secure biometric authentication.
            </footer>

        </div>
    );
};

export default Home;