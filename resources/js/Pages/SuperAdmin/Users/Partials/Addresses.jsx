import DataNotExist from '@/Components/DataNotExist';
import DeleteUserAction from '@/Components/DeleteUserAction';
import Tooltip from '@/Components/Tooltip';

export default function Addresses({ user, className = '' }) {

    const addresses = user?.addresses || [];
    console.log('user', user);
    console.log('addresses', addresses);

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
                    Address List
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    All saved addresses of the user.
                </p>
            </header>

            {/* TABLE */}
            <div className="overflow-x-auto border border-gray-300 dark:border-blue-950 rounded-xl shadow-lg">
                <table className="min-w-full bg-gray-100 text-black dark:bg-[#0a0e25] dark:text-white">
                    <thead className="border-b border-gray-300 dark:border-blue-900">
                        <tr>
                            <th className="p-2 text-center whitespace-nowrap">Sr. No</th>
                            <th className="p-2 text-start whitespace-nowrap">Address Type</th>
                            <th className="p-2 text-center whitespace-nowrap">City / State</th>
                            <th className="p-2 text-start whitespace-nowrap">Full Address</th>
                            <th className="p-2 text-center whitespace-nowrap">Pincode</th>
                        </tr>
                    </thead>

                    <tbody>
                        {addresses.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-600 dark:text-gray-300">
                                    <DataNotExist />
                                </td>
                            </tr>
                        ) : (
                            addresses.map((a, index) => (
                                <tr
                                    key={a.uuid}
                                    className="bg-white text-black text-center hover:bg-gray-100
                                               dark:bg-[#131836] dark:hover:bg-[#0a0e25] dark:text-white"
                                >
                                    <td className="p-2">{index + 1}</td>

                                    {/* Address Type */}
                                    <td className="p-2 text-start capitalize">
                                        {a.address_type || "--"}
                                    </td>

                                    {/* City / State */}
                                    <td className="p-2 text-center">
                                        {a.city_id || "--"} / {a.state_id || "--"}
                                    </td>

                                    {/* Full Address */}
                                    <td className="p-2 text-start">
                                        {a.address}
                                    </td>

                                    {/* Pincode */}
                                    <td className="p-2 text-center">
                                        {a.pincode}
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
