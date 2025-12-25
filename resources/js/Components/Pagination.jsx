import { Link } from '@inertiajs/react';

export default function Pagination({ paginate, className = '' }) {
    if (!paginate || paginate.last_page <= 1) return null;

    const { current_page, last_page, links, from, to, total } = paginate;
    const visiblePages = 5;

    // Extract numeric page links
    const pageLinks = links.filter(
        (l) => l.url && !isNaN(Number(l.label))
    );

    // Find current index
    const currentIndex = pageLinks.findIndex(
        (l) => Number(l.label) === current_page
    );

    const half = Math.floor(visiblePages / 2);
    const start = Math.max(0, currentIndex - half);
    const end = Math.min(pageLinks.length, start + visiblePages);

    const visiblePageLinks = pageLinks.slice(start, end);

    const firstLink = links.find((l) => l.label === '« Previous');
    const lastLink = links.find((l) => l.label === 'Next »');

    return (
        <div className={`w-full px-3 flex justify-between items-center ${className}`}>
            <p className="text-sm text-gray-900 dark:text-gray-200">
                From {from} to {to} of {total}
            </p>

            <div className="flex items-center gap-2 flex-wrap justify-end py-2">

                {/* First */}
                <Link
                    href={links[1]?.url || ''}
                    preserveScroll
                    preserveState
                    className={`rounded-full text-sm w-8 h-8 flex items-center justify-center
                    ${current_page === 1
                            ? 'bg-gray-600 text-gray-200 pointer-events-none'
                            : 'bg-gray-300 hover:bg-[#008F70] hover:text-white'}`}
                >
                    «
                </Link>

                {/* Previous */}
                <Link
                    href={firstLink?.url || ''}
                    preserveScroll
                    preserveState
                    className={`rounded-full text-sm w-8 h-8 flex items-center justify-center
                    ${!firstLink?.url
                            ? 'bg-gray-600 text-gray-200 pointer-events-none'
                            : 'bg-gray-300 hover:bg-[#008F70] hover:text-white'}`}
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
                        className={`rounded-full text-sm w-8 h-8 flex items-center justify-center
                        ${link.active
                                ? 'bg-[#008F70] text-white pointer-events-none'
                                : 'bg-gray-300 hover:bg-[#008F70] hover:text-white'}`}
                    >
                        {link.label}
                    </Link>
                ))}

                {/* Next */}
                <Link
                    href={lastLink?.url || ''}
                    preserveScroll
                    preserveState
                    className={`rounded-full text-sm w-8 h-8 flex items-center justify-center
                    ${!lastLink?.url
                            ? 'bg-gray-600 text-gray-200 pointer-events-none'
                            : 'bg-gray-300 hover:bg-[#008F70] hover:text-white'}`}
                >
                    ›
                </Link>

                {/* Last */}
                <Link
                    href={pageLinks[pageLinks.length - 1]?.url || ''}
                    preserveScroll
                    preserveState
                    className={`rounded-full text-sm w-8 h-8 flex items-center justify-center
                    ${current_page === last_page
                            ? 'bg-gray-600 text-gray-200 pointer-events-none'
                            : 'bg-gray-300 hover:bg-[#008F70] hover:text-white'}`}
                >
                    »
                </Link>
            </div>
        </div>
    );
}
