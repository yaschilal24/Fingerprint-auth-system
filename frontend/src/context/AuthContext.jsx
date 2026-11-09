import {
    createContext,
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getCurrentUser,
    registerWithFingerprint,
    loginWithFingerprint,
    logoutUser,
} from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // ===================================
    // LOAD CURRENT SESSION
    // ===================================

    const refreshUser = useCallback(async () => {
        try {
            const response = await getCurrentUser();

            setUser(response.user || null);

            return response.user || null;
        } catch {
            setUser(null);

            return null;
        }
    }, []);

    useEffect(() => {
        const initialize = async () => {
            await refreshUser();

            setLoading(false);
        };

        initialize();
    }, [refreshUser]);

    // ===================================
    // REGISTER
    // ===================================

    const register = async (data) => {
        setError("");

        try {
            const response =
                await registerWithFingerprint(data);

            setUser(response.user);

            return response;
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Registration failed.";

            setError(message);

            throw new Error(message);
        }
    };

    // ===================================
    // LOGIN
    // ===================================

    const login = async (data) => {
        setError("");

        try {
            const response =
                await loginWithFingerprint(data);

            setUser(response.user);

            return response;
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Authentication failed.";

            setError(message);

            throw new Error(message);
        }
    };

    // ===================================
    // LOGOUT
    // ===================================

    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};