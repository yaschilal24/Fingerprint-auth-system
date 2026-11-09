import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";

import Register from "./pages/Register";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import Admin from "./pages/Admin";

function App() {
    return (
        <BrowserRouter>

            <AuthProvider>

                <Routes>

                    {/* Public pages */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    {/* Protected user pages */}

                    <Route element={<ProtectedRoute />}>

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                    </Route>

                    {/* Admin-only pages */}

                    <Route
                        element={
                            <ProtectedRoute adminOnly />
                        }
                    >

                        <Route
                            path="/admin"
                            element={<Admin />}
                        />

                    </Route>

                    {/* Not found */}

                    <Route
                        path="*"
                        element={
                            <div className="min-h-screen flex items-center justify-center text-white">
                                <div className="text-center">
                                    <h1 className="text-5xl font-bold">
                                        404
                                    </h1>

                                    <p className="text-slate-400 mt-3">
                                        Page not found.
                                    </p>
                                </div>
                            </div>
                        }
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>
    );
}

export default App;