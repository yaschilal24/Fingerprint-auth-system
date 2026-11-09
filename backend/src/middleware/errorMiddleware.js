export const notFound = (req, res, next) => {
    const error = new Error(
        `Route not found: ${req.originalUrl}`
    );

    error.statusCode = 404;

    next(error);
};

export const errorHandler = (error, req, res, next) => {
    console.error("Application error:", error);

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        success: false,

        message:
            process.env.NODE_ENV === "production"
                ? statusCode >= 500
                    ? "Internal server error."
                    : error.message
                : error.message,

        ...(process.env.NODE_ENV !== "production" && {
            stack: error.stack,
        }),
    });
};
