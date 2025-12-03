import { Link } from '@inertiajs/react';

const VehicleInfo = ({ vehicle }) => {
    if (!vehicle) return null;

    return (
        <div className="flex items-center gap-1">
            <div className="flex flex-col space-y-1">
                <p className="text-sm text-gray-900 dark:text-white text-left">
                    {vehicle?.vehicle_number || '--'}
                </p>
                <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-700 dark:text-gray-400">{vehicle?.email || '--'}</p>
                    <p className="text-xs text-gray-700 dark:text-gray-400">{vehicle?.phone || '--'}</p>
                </div>
            </div>
        </div>
    );
};

export default VehicleInfo;
