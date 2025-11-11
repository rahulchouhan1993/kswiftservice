import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

const PartnerAvatarNormal = ({ partner }) => {
    if (!partner) return null;

    return (
        <div className="flex items-start gap-3">
            <div className="flex flex-col space-y-1">
                <p className="text-xs text-gray-900 dark:text-white font-medium">
                    {partner?.name}
                </p>

                {partner?.email && (
                    <div className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-400">
                        <span>{partner?.email || ''}</span>
                    </div>
                )}

                {partner?.phone && (
                    <div className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-400">
                        <span>{partner?.phone || ''}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnerAvatarNormal;
