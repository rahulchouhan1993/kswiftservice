import { useState } from 'react';
import Modal from '@/Components/Modal';
import RoundBtn from '@/Components/RoundBtn';
import { RiInformation2Line } from 'react-icons/ri';
import EditBtn from '@/Components/EditBtn';

export default function GarageInfo({ garage }) {
    const [open, setOpen] = useState(false);

    if (!garage) return null;
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <>
                {"⭐".repeat(fullStars)}
                {halfStar && "⭐"}
                {"☆".repeat(emptyStars)}
            </>
        );
    };

    return (
        <>
            <EditBtn
                onClick={(e) => setOpen(true)}
            >
                <RiInformation2Line size={18} />
            </EditBtn>

            <Modal
                show={open}
                maxWidth="2xl"
                topCloseButton
                handleTopClose={() => setOpen(false)}
            >
                {/* HEADER */}
                <h3 className="px-6 py-3 border-b bg-gray-200 dark:bg-[#131836] font-semibold text-lg text-gray-800 dark:text-white">
                    Garage Details
                </h3>

                <div className="p-6 space-y-6 text-sm">

                    {/* LOGO */}
                    {garage.logo_url && (
                        <div className="flex flex-col items-center gap-2">
                            <img
                                src={garage.logo_url}
                                alt={garage.name}
                                className="h-28 w-28 rounded-xl object-cover shadow-md border"
                            />

                            <div className="flex items-center justify-center">
                                {renderStars(garage.garage_rating)}
                                <span className="ml-2 text-sm text-gray-600">
                                    ({Number(garage.garage_rating).toFixed(1)})
                                </span>
                            </div>
                        </div>
                    )}


                    {/* BASIC INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailRow label="Name" value={garage.name} />
                        <DetailRow label="Owner Name" value={garage.owner_name} />
                        <DetailRow label="Phone" value={garage.phone} />
                        <DetailRow label="Email" value={garage.email} />
                        <DetailRow label="City" value={garage?.city?.name} />
                        <DetailRow label="State" value={garage?.state?.name} />
                        <DetailRow label="Pincode" value={garage.pincode} />
                        <DetailRow label="Total Bays" value={garage.bay_count} />
                    </div>

                    {/* ADDRESS */}
                    <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Full Address
                        </p>
                        <div className="p-3 rounded-lg bg-gray-100 dark:bg-[#1b214a] text-gray-600 dark:text-gray-300">
                            {garage.address}
                        </div>
                    </div>

                    {/* STATUS */}
                    <div>
                        <DetailRow
                            label="Status"
                            value={garage.status === 1 ? 'Active' : 'Inactive'}
                        />
                    </div>

                    {/* TIMINGS */}
                    {garage.timings && (
                        <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Working Timings
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(garage.timings).map(([day, info]) => (
                                    <div
                                        key={day}
                                        className="flex justify-between items-center
                                                   bg-gray-100 dark:bg-[#1b214a]
                                                   rounded-md px-3 py-2"
                                    >
                                        <span className="capitalize font-medium text-gray-600 dark:text-gray-400">
                                            {day}
                                        </span>

                                        {info.status === 'open' ? (
                                            <span className="text-green-600 dark:text-green-400">
                                                {info.timing}
                                            </span>
                                        ) : (
                                            <span className="text-red-500">Closed</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="flex justify-between items-center bg-gray-100 dark:bg-[#1b214a]
                        rounded-md px-3 py-2 text-gray-700 dark:text-gray-300">
            <span className="font-medium text-gray-600 dark:text-gray-400">
                {label}:
            </span>
            <span className="text-right">{value || '--'}</span>
        </div>
    );
}
