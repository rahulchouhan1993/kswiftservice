const UserAvatarCard = ({ user }) => {
    if (!user) return null;

    return (
        <div className="flex items-center gap-1 ">
            <img
                src={user?.profile_photo_url}
                alt={user?.name}
                className="inline-block h-12 w-12 rounded-full object-cover"
            />
            <div className="flex flex-col space-y-1">
                <p className="text-sm text-gray-900 dark:text-white text-left">
                    {user?.name}
                </p>
                <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-700 dark:text-gray-400">{user?.email}</p>
                    <p className="text-xs text-gray-700 dark:text-gray-400">{user?.phone}</p>
                </div>
            </div>
        </div>
    );
};

export default UserAvatarCard;
