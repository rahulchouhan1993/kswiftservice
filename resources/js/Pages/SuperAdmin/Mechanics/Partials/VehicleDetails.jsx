import { useState } from 'react';
import Modal from '@/Components/Modal';
import RoundBtn from '@/Components/RoundBtn';
import { RiInformation2Line } from 'react-icons/ri';

export default function VehicleDetails({ vehicle }) {
    const [open, setOpen] = useState(false);

    const closeModal = () => setOpen(false);

    return (
        <>
            <RoundBtn onClick={() => setOpen(true)}>
                <RiInformation2Line size={18} />
            </RoundBtn>

            <Modal show={open} maxWidth="lg" topCloseButton={true} handleTopClose={closeModal}>
                <h3 className="px-6 py-3 border-b bg-gray-200 dark:bg-[#131836]
                               font-semibold text-lg text-gray-800 dark:text-white">
                    Vehicle Details
                </h3>

                <div className="p-6 space-y-5 text-sm">

                    {/* Vehicle Image */}
                    {vehicle?.vehicle_photos?.length > 0 && (
                        <div className="w-full flex justify-center">
                            <img
                                src={vehicle.vehicle_photos[0].photo_url}
                                alt="Vehicle Photo"
                                className="h-40 w-auto rounded-lg shadow-md object-cover"
                            />
                        </div>
                    )}

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailRow label="Vehicle Number" value={vehicle?.vehicle_number} />
                        <DetailRow label="Model" value={vehicle?.model} />

                        <DetailRow label="Vehicle Type" value={vehicle?.vehicle_type} />
                        <DetailRow label="Year" value={vehicle?.vehicle_year} />

                        <DetailRow label="Fuel Type" value={vehicle?.fuel_type} />
                        <DetailRow label="Transmission" value={vehicle?.transmission} />
                        <DetailRow label="Mileage" value={vehicle?.mileage} />
                    </div>

                    {vehicle?.additional_note && (
                        <div className="mt-4">
                            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Note:</p>
                            <div className="p-3 rounded-lg bg-gray-100 dark:bg-[#1b214a] text-gray-600 dark:text-gray-300">
                                {vehicle.additional_note}
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
            <span className="font-medium text-gray-600 dark:text-gray-400">{label}:</span>
            <span className="text-right">{value || "--"}</span>
        </div>
    );
}
