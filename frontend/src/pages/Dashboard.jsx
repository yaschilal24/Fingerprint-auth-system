import { useEffect, useState } from "react";

import {
    Fingerprint,
    ShieldCheck,
    Clock,
    User,
} from "lucide-react";

import Navbar from "../components/Navbar";

import useAuth from "../hooks/useAuth";

import api from "../services/api";

const Dashboard = () => {
    const { user } = useAuth();

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const response = await api.get("/users/history");

                setHistory(response.data.history);
            } catch (error) {
                console.error(
                    "Could not load authentication history:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, []);

    return (
        <div className="min-h-screen">

            <Navbar />

            <main className="max-w-7xl mx-auto px-5 py-10">

                <div className="mb-10">
                    <p className="text-cyan-400 text-sm">
                        USER DASHBOARD
                    </p>

                    <h1 className="text-3xl font-bold mt-2">
                        Welcome, {user?.fullName}
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Manage your secure authentication account.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-5">

                    <div className="glass-panel rounded-2xl p-6">
                        <User className="text-cyan-400 mb-4" />

                        <p className="text-slate-400 text-sm">
                            Account name
                        </p>

                        <h2 className="font-bold mt-2">
                            {user?.fullName}
                        </h2>
                    </div>

                    <div className="glass-panel rounded-2xl p-6">
                        <ShieldCheck className="text-green-400 mb-4" />

                        <p className="text-slate-400 text-sm">
                            Account status
                        </p>

                        <h2 className="font-bold text-green-400 mt-2">
                            Authenticated
                        </h2>
                    </div>

                    <div className="glass-panel rounded-2xl p-6">
                        <Fingerprint className="text-blue-400 mb-4" />

                        <p className="text-slate-400 text-sm">
                            Authentication
                        </p>

                        <h2 className="font-bold mt-2">
                            WebAuthn
                        </h2>
                    </div>
                </div>

                <section className="mt-10">

                    <div className="flex items-center gap-3 mb-5">
                        <Clock className="text-cyan-400" />

                        <h2 className="text-xl font-bold">
                            Authentication history
                        </h2>
                    </div>

                    <div className="glass-panel rounded-2xl p-5">

                        {loading ? (
                            <p className="text-slate-400">
                                Loading history...
                            </p>
                        ) : history.length === 0 ? (
                            <p className="text-slate-400">
                                No authentication history found.
                            </p>
                        ) : (
                            <div className="space-y-4">

                                {history.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between gap-4 border-b border-white/10 pb-3"
                                    >
                                        <div>
                                            <p className="font-semibold">
                                                {item.event_type}
                                            </p>

                                            <p className="text-xs text-slate-400 mt-1">
                                                {new Date(
                                                    item.created_at
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        <span className="text-green-400 text-sm">
                                            {item.success
                                                ? "Successful"
                                                : "Failed"}
                                        </span>
                                    </div>
                                ))}

                            </div>
                        )}

                    </div>
                </section>

            </main>
        </div>
    );
};

export default Dashboard;