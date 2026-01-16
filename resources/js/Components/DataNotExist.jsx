import { usePage } from '@inertiajs/react';
import { MdOutlineError } from "react-icons/md";

export default function DataNotExist({ className = '' }) {
    const { auth } = usePage().props;

    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center dark:bg-[#131836]">

            {/* Icon */}
            <div className="flex justify-center mb-3">
                <span className="h-20 w-20">
                    <MdOutlineError
                        className="h-full w-full text-[#52C5FA]"
                        aria-hidden
                    />
                </span>
            </div>

            {/* Gradient Heading */}
            <h1
                className={`
                    text-2xl font-bold
                    bg-gradient-to-r
                    from-[#08365C] to-[#52C5FA]
                    bg-clip-text text-transparent
                    ${className}
                `}
            >
                Sorry, data does not exist.
            </h1>

        </div>
    );
}
