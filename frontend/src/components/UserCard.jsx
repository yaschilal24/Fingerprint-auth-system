import { User, Fingerprint, CheckCircle } from "lucide-react";

const UserCard = ({ user }) => {
    return (
        <div className="glass-panel rounded-xl p-4 flex items-center justify-between gap-3">

            <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-full bg-blue-600/20 border border-blue-400/40 flex items-center justify-center">
                    <User className="text-cyan-300" />
                </div>

                <div>
                    <h3 className="font-semibold text-white">
                        {user.full_name}
                    </h3>

                    <p className="text-xs text-slate-400">
                        {user.email}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">

                <span className="text-xs text-slate-400 hidden sm:block">
                    {user.authenticator_count ?? 1} device(s)
                </span>

                <Fingerprint className="text-cyan-400" size={20} />

                <CheckCircle
                    className="text-green-400"
                    size={20}
                />
            </div>
        </div>
    );
};

export default UserCard;