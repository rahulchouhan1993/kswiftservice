import { Link } from '@inertiajs/react';

export default function Pagination({ paginate, className = '' }) {
    if (!paginate || paginate.last_page <= 1) return null;

    const { current_page, last_page } = paginate;
    const visiblePages = 5;

    // Determine the page range to show
    let startPage = Math.max(1, current_page - Math.floor(visiblePages / 2));
    let endPage = startPage + visiblePages - 1;
    if (endPage > last_page) {
        endPage = last_page;
        startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className={`w-full px-3 flex justify-between items-center ${className}`}>
            <p className="text-sm text-gray-900 dark:text-gray-200">
                {`From ${paginate.from} to ${paginate.to} of ${paginate.total}`}
            </p>

            <div className="flex items-center gap-2 flex-wrap justify-end py-2">
                {/* First */}
                <Link
                    href={`?page=1`}
                    preserveScroll
                    className={`rounded-full text-sm w-8 h-8 flex items-center justify-center
                    ${current_page === 1 ? 'bg-gray-600 text-gray-200 pointer-events-none' : 'bg-gray-300 hover:bg-[#008F70] hover:text-white'}`}
                >
                    «
                </Link>

                {/* Previous */}
                <Link
                    href={`?page=${current_page - 1}`}
                    preserveScroll
                    className={`rounded-full text-sm w-8 h-8 flex items-center justify-center
                    ${current_page === 1 ? 'bg-gray-600 text-gray-200 pointer-events-none' : 'bg-gray-300 hover:bg-[#008F70] hover:text-white'}`}
                >
                    ‹
                </Link>

                {/* Page Numbers */}
                {pageNumbers.map((page) => (
                    <Link
                        key={page}
                        href={`?page=${page}`}
                        preserveScroll
                        className={`rounded-full text-sm w-8 h-8 flex items-center justify-center
                        ${page === current_page
                                ? 'bg-[#008F70] text-white pointer-events-none'
                                : 'bg-gray-300 hover:bg-[#008F70] hover:text-white'}`}
                    >
                        {page}
                    </Link>
                ))}

                {/* Next */}
                <Link
                    href={`?page=${current_page + 1}`}
                    preserveScroll
                    className={`rounded-full text-sm w-8 h-8 flex items-center justify-center
                    ${current_page === last_page ? 'bg-gray-600 text-gray-200 pointer-events-none' : 'bg-gray-300 hover:bg-[#008F70] hover:text-white'}`}
                >
                    ›
                </Link>

                {/* Last */}
                <Link
                    href={`?page=${last_page}`}
                    preserveScroll
                    className={`rounded-full text-sm w-8 h-8 flex items-center justify-center
                    ${current_page === last_page ? 'bg-gray-600 text-gray-200 pointer-events-none' : 'bg-gray-300 hover:bg-[#008F70] hover:text-white'}`}
                >
                    »
                </Link>
            </div>
        </div>
    );
}
