import { CheckCircle, AlertCircle, Info } from "lucide-react";

const StatusMessage = ({ type = "info", message }) => {
    if (!message) return null;

    const styles = {
        success: "bg-green-500/10 border-green-500/40 text-green-400",
        error: "bg-red-500/10 border-red-500/40 text-red-400",
        info: "bg-blue-500/10 border-blue-500/40 text-blue-400",
    };

    const Icon =
        type === "success"
            ? CheckCircle
            : type === "error"
                ? AlertCircle
                : Info;

    return (
        <div
            role="status"
            aria-live="polite"
            className={`flex items-center gap-3 border rounded-xl p-4 ${styles[type]}`}
        >
            <Icon size={20} />

            <p className="text-sm">
                {message}
            </p>
        </div>
    );
};

export default StatusMessage;