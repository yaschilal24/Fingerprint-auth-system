import { Fingerprint, ScanFace } from "lucide-react";

const FingerprintScanner = ({
    loading = false,
    status = "Place your finger...",
}) => {
    return (
        <div className="glass-panel rounded-3xl p-8 text-center relative overflow-hidden">

            <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />

            <div className="relative z-10">

                <div className="flex justify-center mb-6">

                    <div className="relative w-48 h-48 rounded-full border border-cyan-400/40 flex items-center justify-center neon-blue">

                        <div className="absolute inset-3 rounded-full border border-blue-400/30" />

                        <div className="absolute inset-6 rounded-full border border-cyan-400/20" />

                        <Fingerprint
                            size={115}
                            strokeWidth={1.4}
                            className={`text-cyan-300 fingerprint-scan ${
                                loading ? "animate-pulse" : ""
                            }`}
                        />

                        {loading && (
                            <div className="absolute left-0 right-0 h-1 bg-cyan-300 shadow-[0_0_20px_#00cfff] scan-line" />
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-cyan-300">

                    <ScanFace size={18} />

                    <p className="font-semibold">
                        {status}
                    </p>
                </div>

                <p className="text-slate-400 text-xs mt-3">
                    Secure device authentication powered by WebAuthn
                </p>
            </div>
        </div>
    );
};

export default FingerprintScanner;