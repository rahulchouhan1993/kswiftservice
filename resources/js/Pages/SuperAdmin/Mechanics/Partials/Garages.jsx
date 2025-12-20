import DataNotExist from '@/Components/DataNotExist';
import DeleteUserAction from '@/Components/DeleteUserAction';
import Tooltip from '@/Components/Tooltip';
import GarageInfo from './GarageInfo';

export default function Garages({ garages = [], className = '' }) {

    return (
        <section
            className={`
                w-full
                bg-white dark:bg-blue-950
                rounded-2xl
                shadow-xl
                border border-gray-200 dark:border-blue-900
                p-6 space-y-8
                transition-all duration-300
                ${className}
            `}
        >
            {/* HEADER */}
            <header className="pb-4 border-b border-gray-200 dark:border-blue-900">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Garages List
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    All saved garages of the mechanic.
                </p>
            </header>

            {/* TABLE */}
            <div className="overflow-x-auto border border-gray-300 dark:border-blue-950 rounded-xl shadow-lg">
                <table className="min-w-full bg-gray-100 dark:bg-[#0a0e25] text-sm">
                    <thead className="border-b border-gray-300 dark:border-blue-900 text-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="p-3 text-center">#</th>
                            <th className="p-3 text-left">Garage</th>
                            <th className="p-3 text-center">City / State</th>
                            <th className="p-3 text-left">Address</th>
                            <th className="p-3 text-center">Pincode</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {garages.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-8 text-center">
                                    <DataNotExist />
                                </td>
                            </tr>
                        ) : (
                            garages.map((g, index) => (
                                <tr
                                    key={g.uuid}
                                    className="border-b border-gray-200 dark:border-blue-900
                                               bg-white dark:bg-[#131836]
                                               hover:bg-gray-100 dark:hover:bg-[#0a0e25]
                                               transition"
                                >
                                    {/* Sr No */}
                                    <td className="p-3 text-center">
                                        {index + 1}
                                    </td>

                                    {/* Garage Name + Logo */}
                                    <td className="p-3 flex items-center gap-3">
                                        <img
                                            src={g.logo_url}
                                            alt={g.name}
                                            className="w-10 h-10 rounded-lg object-cover border"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {g.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Owner: {g.owner_name}
                                            </p>
                                        </div>
                                    </td>

                                    {/* City / State */}
                                    <td className="p-3 text-center">
                                        {g?.city?.name || '--'} / {g?.state?.name || '--'}
                                    </td>

                                    {/* Address */}
                                    <td className="p-3">
                                        {g.address}
                                    </td>

                                    {/* Pincode */}
                                    <td className="p-3 text-center">
                                        {g.pincode}
                                    </td>

                                    {/* Status */}
                                    <td className="p-3 text-center">
                                        {g.status === 1 ? (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-3 text-center">
                                        <GarageInfo garage={g} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
