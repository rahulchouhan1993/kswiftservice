import { Link } from '@inertiajs/react';

export default function Pagination({ paginate, className = '' }) {
    if (!paginate || paginate.last_page <= 1) return null;

    const { current_page, last_page, links, from, to, total } = paginate;
    const visiblePages = 5;

    const pageLinks = links.filter(
        (l) => l.url && !isNaN(Number(l.label))
    );

    const currentIndex = pageLinks.findIndex(
        (l) => Number(l.label) === current_page
    );

    const half = Math.floor(visiblePages / 2);
    const start = Math.max(0, currentIndex - half);
    const end = Math.min(pageLinks.length, start + visiblePages);
    const visiblePageLinks = pageLinks.slice(start, end);

    const prevLink = links.find((l) => l.label === '« Previous');
    const nextLink = links.find((l) => l.label === 'Next »');

    const baseBtn =
        'rounded-full text-sm w-8 h-8 flex items-center justify-center transition duration-200';

    const activeBtn =
        'bg-gradient-to-r from-[#08365C] to-[#52C5FA] text-white pointer-events-none';

    const normalBtn =
        'bg-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-[#08365C] hover:to-[#52C5FA] hover:text-white';

    const disabledBtn =
        'bg-gray-400 text-gray-200 pointer-events-none';

    return (
        <div className={`w-full px-3 flex justify-between items-center ${className}`}>
            <p className="text-sm text-gray-900 dark:text-gray-200">
                From {from} to {to} of {total}
            </p>

            <div className="flex items-center gap-2 flex-wrap justify-end py-2">

                {/* First */}
                <Link
                    href={pageLinks[0]?.url || ''}
                    preserveScroll
                    preserveState
                    className={`${baseBtn} ${current_page === 1 ? disabledBtn : normalBtn
                        }`}
                >
                    «
                </Link>

                {/* Previous */}
                <Link
                    href={prevLink?.url || ''}
                    preserveScroll
                    preserveState
                    className={`${baseBtn} ${!prevLink?.url ? disabledBtn : normalBtn
                        }`}
                >
                    ‹
                </Link>

                {/* Page Numbers */}
                {visiblePageLinks.map((link) => (
                    <Link
                        key={link.label}
                        href={link.url}
                        preserveScroll
                        preserveState
                        className={`${baseBtn} ${link.active ? activeBtn : normalBtn
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}

                {/* Next */}
                <Link
                    href={nextLink?.url || ''}
                    preserveScroll
                    preserveState
                    className={`${baseBtn} ${!nextLink?.url ? disabledBtn : normalBtn
                        }`}
                >
                    ›
                </Link>

                {/* Last */}
                <Link
                    href={pageLinks[pageLinks.length - 1]?.url || ''}
                    preserveScroll
                    preserveState
                    className={`${baseBtn} ${current_page === last_page ? disabledBtn : normalBtn
                        }`}
                >
                    »
                </Link>
            </div>
        </div>
    );
}
