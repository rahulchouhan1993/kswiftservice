import DataNotExist from '@/Components/DataNotExist';
import { useHelpers } from '@/Components/Helpers';
export default function WalletTransitions({ wallet_transitions, className='' }) {
    const {displayInRupee, replaceUnderscoreWithSpace} = useHelpers();
    
    const badgeBase = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize";
    const statusBadge = (status) => {
        console.log('status', status);
        const colors = {
            debit: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
            credit: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        };
        return <span className={`${badgeBase} ${colors[status]}`}>{replaceUnderscoreWithSpace(status)}</span>;
    };

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
                    Wallet Transitions
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    All wallet transitions of the mechanic. 
                </p>
            </header>

            {/* TABLE */}
            <div className="overflow-x-auto border border-gray-300 dark:border-blue-950 rounded-xl shadow-lg">
                <table className="min-w-full bg-gray-100 dark:bg-[#0a0e25] text-sm">
                    <thead className="border-b border-gray-300 dark:border-blue-900 text-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="p-3 text-center">#</th>
                            <th className="p-3 text-left">TxnId</th>
                            <th className="p-3 text-center">Txn. Type</th>
                            <th className="p-3 text-left">Amount</th>
                            <th className="p-3 text-center">Current Balance</th>
                            <th className="p-3 text-center">Invoice</th>
                            <th className="p-3 text-center">Txn. Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {wallet_transitions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-8 text-center">
                                    <DataNotExist />
                                </td>
                            </tr>
                        ) : (
                            wallet_transitions.map((g, index) => (
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

                                    {/* TxnId */}
                                    <td className="p-3 text-left">
                                        {g.txn_id}
                                    </td>

                                    {/* Txn. Type */}
                                    <td className="p-3 text-center">
                                        {statusBadge(g?.txn_type)}
                                    </td>

                                    {/* Amount */}
                                    <td className="p-3 text-left">
                                        {displayInRupee(g?.amount) || '--'}
                                    </td>

                                    {/* Current Balance */}
                                    <td className="p-3 text-center">
                                        {displayInRupee(g?.current_balance) || '--'}
                                    </td>

                                    {/* Invoice */}
                                    <td className="p-3 text-center">
                                        {g?.invoice_path ? (
                                            <a
                                                href={g.invoice_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                View Invoice
                                            </a>
                                        ) : (
                                            '--'
                                        )}
                                    </td>

                                    {/* Txn. Date */}
                                    <td className="p-3 text-center">
                                        {g?.txn_date || '--'}
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
