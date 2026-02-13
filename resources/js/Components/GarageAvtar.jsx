import { Link } from "@inertiajs/react";
import StarRating from "./StarRating";

const GarageAvtar = ({ garage }) => {
    if (!garage) return null;

    console.log('garage', garage);
    return (
        <div
            className="flex gap-2 px-2 py-1.5 rounded-md transition items-center"
        >
            <img
                src={garage?.logo_url}
                alt={garage?.name}
                className="h-12 w-12 rounded-10 object-cover ring-1 ring-gray-200 dark:ring-gray-700"
            />

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">
                        {garage.name ?? "--"}
                    </p>

                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
                        <StarRating rating={garage.garage_reviews} />
                        <span className="text-xs">({garage.garage_reviews})</span>
                    </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {garage?.phone || "--"}
                </p>
            </div>
        </div>
    );
};

export default GarageAvtar;
