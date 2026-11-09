import { Link, useNavigate } from "react-router-dom";

import {
    Fingerprint,
    ShieldCheck,
    LogOut,
    LayoutDashboard,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

const Navbar = () => {
    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();

        navigate("/login");
    };

    return (
        <nav className="border-b border-blue-500/20 bg-slate-950/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >
                    <Fingerprint
                        className="text-cyan-400"
                        size={34}
                    />

                    <div>
                        <h1 className="font-bold text-white">
                            Bio<span className="text-cyan-400">Secure</span>
                        </h1>

                        <p className="text-xs text-slate-400">
                            Fingerprint Authentication
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-4">

                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="text-sm text-slate-300 hover:text-cyan-400 flex items-center gap-2"
                            >
                                <LayoutDashboard size={17} />
                                Dashboard
                            </Link>

                            {user.role === "admin" && (
                                <Link
                                    to="/admin"
                                    className="text-sm text-slate-300 hover:text-cyan-400"
                                >
                                    Admin
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/20"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">
                                    Logout
                                </span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm text-slate-300 hover:text-cyan-400"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold"
                            >
                                Register
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </nav>
    );
};

export default Navbar;