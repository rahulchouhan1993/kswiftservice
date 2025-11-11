import { usePage } from '@inertiajs/react';
import { MdOutlineError } from "react-icons/md";

export default function DataNotExist({ className = '' }) {
    const { auth } = usePage().props;

    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center dark:bg-[#131836]">
            <div className="flex justify-center">
                {/* <img src="/images/common/data_not_found.png" className="w-40 md:w-52" alt="Data Not Found" /> */}
                <span className='h-20 w-20 '><MdOutlineError className='h-full w-full text-purple-400 ' alt="Data Not Found" /></span>
            </div>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {/* Sorry, {auth?.user?.name || 'User'} data does not exist. */}
                Sorry, data does not exist.
            </h1>

        </div>
    );
}
