import { Link } from "@inertiajs/react";

const UserAvatarCard = ({ user, displayRole = false }) => {
    if (!user) return null;

    const userRoute =
        user.role === "customer"
            ? route("superadmin.user.details", { uuid: user.uuid })
            : route("superadmin.mechanic.details", { uuid: user.uuid });

    const roleColor =
        user.role === "mechanic"
            ? "bg-red-100 text-red-700"
            : user.role === "customer"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600";

    return (
        <Link href={userRoute} className="block">
            <div
                className="flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#1a1f4a] transition items-center"
            >
                {/* Avatar */}
                <img
                    src={user?.profile_photo_url}
                    alt={user?.name}
                    className="h-12 w-12 rounded-10 object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                />

                {/* Info */}
                <div className="min-w-0 flex-1">
                    {/* Name + Role */}
                    <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">
                            {user?.name || "--"}
                        </p>

                        {displayRole && (
                            <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${roleColor}`}
                            >
                                {user.role}
                            </span>
                        )}
                    </div>

                    {/* Email */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {user?.email || "--"}
                    </p>

                    {/* Phone */}
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        {user?.phone || "--"}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default UserAvatarCard;
