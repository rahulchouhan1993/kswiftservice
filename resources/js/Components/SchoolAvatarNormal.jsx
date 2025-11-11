import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

const SchoolAvatarNormal = ({ school }) => {
    if (!school) return null;

    return (
        <div className="flex items-start gap-3">
            <div className="flex flex-col space-y-1">
                <p className="text-xs text-gray-900 dark:text-white font-medium whitespace-nowrap">
                    {school?.name}
                </p>

                {school?.admin?.email && (
                    <div className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-400">
                        <span>{school.admin.email}</span>
                    </div>
                )}

                {school?.admin?.phone && (
                    <div className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-400">
                        <span>{school.admin.phone}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchoolAvatarNormal;
