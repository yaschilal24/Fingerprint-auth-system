export const protect = (req, res, next) => {
    if (!req.session?.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please log in.",
        });
    }

    next();
};

export const adminOnly = (req, res, next) => {
    if (!req.session?.user) {
        return res.status(401).json({
            success: false,
            message: "Please log in first.",
        });
    }

    if (req.session.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Administrator access required.",
        });
    }

    next();
};