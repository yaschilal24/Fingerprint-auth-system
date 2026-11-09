import { useEffect, useState } from "react";

import {
    Users,
    ShieldCheck,
    UserX,
    RefreshCw,
} from "lucide-react";

import Navbar from "../components/Navbar";

import UserCard from "../components/UserCard";

import StatusMessage from "../components/StatusMessage";

import api from "../services/api";

const Admin = () => {
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const loadUsers = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/users");

            setUsers(response.data.users);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load registered users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const deactivateUser = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to deactivate this account?"
        );

        if (!confirmed) return;

        try {
            await api.patch(`/users/${id}/deactivate`);

            await loadUsers();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to deactivate account."
            );
        }
    };

    return (
        <div className="min-h-screen">

            <Navbar />

            <main className="max-w-7xl mx-auto px-5 py-10">

                <div className="flex flex-wrap items-center justify-between gap-4 mb-9">

                    <div>
                        <p className="text-cyan-400 text-sm">
                            ADMINISTRATION
                        </p>

                        <h1 className="text-3xl font-bold mt-2">
                            Admin Dashboard
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Manage registered authentication accounts.
                        </p>
                    </div>

                    <button
                        onClick={loadUsers}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 px-4 py-3 rounded-xl hover:bg-blue-500"
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>

                </div>

                <div className="grid md:grid-cols-2 gap-5 mb-9">

                    <div className="glass-panel rounded-2xl p-6">
                        <Users className="text-cyan-400 mb-3" />

                        <p className="text-slate-400 text-sm">
                            Total registered users
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {users.length}
                        </h2>
                    </div>

                    <div className="glass-panel rounded-2xl p-6">
                        <ShieldCheck className="text-green-400 mb-3" />

                        <p className="text-slate-400 text-sm">
                            Active accounts
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {users.filter(
                                (user) => user.is_active
                            ).length}
                        </h2>
                    </div>

                </div>

                <section>
                    <h2 className="text-xl font-bold mb-5">
                        Registered Users
                    </h2>

                    {error && (
                        <div className="mb-5">
                            <StatusMessage
                                type="error"
                                message={error}
                            />
                        </div>
                    )}

                    {loading ? (
                        <p className="text-slate-400">
                            Loading users...
                        </p>
                    ) : users.length === 0 ? (
                        <p className="text-slate-400">
                            No registered users found.
                        </p>
                    ) : (
                        <div className="space-y-4">

                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="space-y-2"
                                >
                                    <UserCard user={user} />

                                    <div className="flex items-center justify-between px-3">

                                        <span className="text-xs text-slate-400">
                                            {user.role} · {user.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                        {user.is_active && (
                                            <button
                                                onClick={() =>
                                                    deactivateUser(user.id)
                                                }
                                                className="text-xs text-red-400 flex items-center gap-2 hover:text-red-300"
                                            >
                                                <UserX size={15} />
                                                Deactivate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </section>

            </main>
        </div>
    );
};

export default Admin;