import { Link } from "@inertiajs/react";
import { memo } from "react";

function StatCard({
    title,
    value,
    icon: Icon,
    href,
    color = "sky",
    chart
}) {
    const Wrapper = href ? Link : "div";

    return (
        <Wrapper
            href={href}
            className="
                relative group
                bg-white dark:bg-[#0f172a]
                rounded-xl
                px-4 py-3
                border border-gray-100 dark:border-white/5
                shadow-sm
                hover:shadow-lg
                transition-all duration-300
                hover:-translate-y-1
            "
        >
            {/* glow */}
            <div
                className={`
                    absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                    bg-gradient-to-br from-${color}-400/10 to-transparent
                    transition
                `}
            />

            <div className="relative flex items-center justify-between gap-3">
                <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {title}
                    </p>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {value}
                    </h3>
                </div>

                <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center
                        bg-${color}-100 dark:bg-${color}-900/30`}
                >
                    <Icon
                        size={16}
                        className={`text-${color}-600 dark:text-${color}-300`}
                    />
                </div>
            </div>

            {chart && (
                <div className="h-8 mt-2 opacity-70 group-hover:opacity-100 transition">
                    {chart}
                </div>
            )}
        </Wrapper>
    );
}

export default memo(StatCard);
