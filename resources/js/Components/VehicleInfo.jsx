import { Link } from '@inertiajs/react';
import { FaCarSide, FaMotorcycle, FaTruckPickup } from 'react-icons/fa6';
import { useHelpers } from './Helpers';

const VehicleInfo = ({ vehicle }) => {
    const { capitalizeWords, replaceUnderscoreWithSpace } = useHelpers();
    console.log('vehicle', vehicle);
    if (!vehicle) return null;

    const getVehicleIcon = (type) => {
        switch (type) {
            case "four_wheeler":
                return <FaCarSide />;
            case "two_wheeler":
                return <FaMotorcycle />;
            case "three_wheeler":
                return <FaTruckPickup />;
            default:
                return null;
        }
    };

    return (
        <div className="flex items-center gap-1">
            <div className="flex flex-col space-y-1">
                <p className="flex gap-2 text-sm text-gray-900 dark:text-white text-left items-center">
                    {vehicle?.vehicle_number || "--"} ({capitalizeWords(replaceUnderscoreWithSpace(vehicle?.vehicle_type))})
                </p>
                <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-700 dark:text-gray-400">Make: {capitalizeWords(vehicle?.vehile_make?.name) || '--'}</p>
                    <p className="text-xs text-gray-700 dark:text-gray-400">Model: {vehicle?.model || '--'}</p>
                </div>
            </div>
        </div>
    );
};

export default VehicleInfo;
