const StudentAvatarCard = ({
    student,
    size = 12,
    radius = "full",
    clickable = true,
}) => {
    if (!student) return null;

    const sizeClass = `h-${size} w-${size}`;
    const radiusClass = radius === "full" ? "rounded-full" : `rounded-${radius}`;

    const cardContent = (
        <div className="flex items-center gap-1">
            <img
                src={student?.profile_photo_url}
                alt={student?.name}
                className={`inline-block object-cover ${sizeClass} ${radiusClass}`}
            />
            <div className="flex flex-col space-y-1">
                <p className="text-sm text-gray-900 dark:text-white text-left">
                    {student?.name}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Reg. No:</span>
                        <span>{student?.reg_no ?? '--'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Roll No:</span>
                        <span>{student?.roll_no ?? '--'}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return clickable ? (
        <a href={route('school.management.student.info', { uuid: student?.uuid })}>
            {cardContent}
        </a>
    ) : (
        cardContent
    );
};

export default StudentAvatarCard;
