import DataNotExist from "@/Components/DataNotExist";
import DeleteUserAction from "@/Components/DeleteUserAction";
import Tooltip from "@/Components/Tooltip";
import { FaCar, FaCaravan } from "react-icons/fa6";
import { RiMotorbikeFill } from "react-icons/ri";
import VehicleDetails from "./VehicleDetails";

export default function Vehicles({ user, className = "" }) {
    const vehicles = user?.vehicles || [];

    console.log('vehicles', vehicles);

    return (
        <section
            className={`
                w-full
                bg-white dark:bg-blue-950
                rounded-2xl shadow-xl
                border border-gray-200 dark:border-blue-900
                p-6 space-y-8
                transition-all duration-300
                ${className}
            `}
        >
            {/* HEADER */}
            <header className="pb-4 border-b border-gray-200 dark:border-blue-900">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Vehicle List
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Vehicles added by this user.
                </p>
            </header>

            {/* NO VEHICLES */}
            {vehicles.length === 0 ? (
                <div className="py-10 text-center">
                    <DataNotExist />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((v) => (
                        <VehicleCard key={v.uuid} vehicle={v} />
                    ))}
                </div>
            )}
        </section>
    );
}

function VehicleCard({ vehicle }) {
    const firstPhoto = vehicle.vehicle_photos?.[0]?.photo_url;

    // Vehicle Icons Based on Type
    const getVehicleIcon = (type) => {
        switch (type) {
            case "two_wheeler":
                return (
                    <RiMotorbikeFill />
                );

            case "three_wheeler":
                return (
                    <FaCaravan />
                );

            case "four_wheeler":
                return (
                    <FaCar />
                );

            default:
                return null;
        }
    };

    return (
        <div
            className="
            bg-gray-100 dark:bg-[#131836]
            rounded-2xl overflow-hidden
            border border-gray-300 dark:border-blue-900
            shadow-xl hover:shadow-2xl
            transition-all duration-300
        "
        >
            {/* IMAGE */}
            <div className="relative w-full h-44 bg-gray-300 dark:bg-[#0e1328]">
                {firstPhoto ? (
                    <img
                        src={firstPhoto}
                        alt="vehicle"
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="flex items-center justify-center text-gray-500 dark:text-gray-300 w-full h-full">
                        No Image
                    </div>
                )}

                {/* ICON IN CORNER */}
                <div className="absolute top-2 right-2 bg-white dark:bg-[#1f2a4a] p-2 rounded-lg shadow-md">
                    {getVehicleIcon(vehicle.vehicle_type)}
                </div>
            </div>

            {/* BODY */}
            <div className="p-4 space-y-2 text-gray-900 dark:text-gray-200">

                {/* Vehicle Title */}
                <h3 className="text-xl font-semibold flex items-center justify-between">
                    {vehicle.vehicle_number}

                    <span
                        className={`
                            text-xs px-2 py-1 rounded-full
                            ${vehicle.status === 1
                                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                            }
                        `}
                    >
                        {vehicle.status === 1 ? "Active" : "Inactive"}
                    </span>
                </h3>

                <p className="text-sm">
                    <span className="font-semibold">Make:</span> {vehicle?.vehile_make?.name || '--'}
                </p>
                <p className="text-sm">
                    <span className="font-semibold">Model:</span> {vehicle?.model || '--'}
                </p>
            </div>

            <div className="flex justify-end p-4 pt-0">
                <VehicleDetails vehicle={vehicle} />
                <div data-tooltip-target={`tooltip-delete-${vehicle.uuid}`}>
                    <DeleteUserAction
                        action=""
                        message="Are you sure you want to delete this vehicle?"
                    />
                </div>

                <Tooltip
                    targetEl={`tooltip-delete-${vehicle.uuid}`}
                    title="Delete Vehicle"
                />
            </div>
        </div>
    );
}

