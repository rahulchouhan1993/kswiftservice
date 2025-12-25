import { useState } from "react";
import Modal from "@/Components/Modal";
import RoundBtn from "@/Components/RoundBtn";
import { RiInformation2Line } from "react-icons/ri";
import { useHelpers } from "@/Components/Helpers";

export default function VehicleDetails({ vehicle }) {
    const [open, setOpen] = useState(false);
    const { capitalizeWords, replaceUnderscoreWithSpace } = useHelpers();

    const closeModal = () => setOpen(false);

    return (
        <>
            <RoundBtn
                onClick={() => setOpen(true)}
                className="h-9 w-9 "
            >
                <RiInformation2Line size={20} />
            </RoundBtn>


            <Modal
                show={open}
                maxWidth="2xl"
                topCloseButton={true}
                handleTopClose={closeModal}
            >
                {/* Header */}
                <h3 className="px-6 py-3 border-b bg-gray-200 dark:bg-[#131836] font-semibold text-lg text-gray-800 dark:text-white">
                    Vehicle Details
                </h3>

                <div className="p-6 space-y-6 text-sm">

                    {/* ================= Vehicle Photos ================= */}
                    {vehicle?.vehicle_photos?.length > 0 && (
                        <div>
                            <h4 className="mb-3 font-semibold text-gray-700 dark:text-gray-300">
                                Vehicle Photos
                            </h4>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {vehicle.vehicle_photos.map((photo, index) => (
                                    <div
                                        key={index}
                                        className="overflow-hidden rounded-lg border border-gray-300 dark:border-blue-900 bg-gray-100 dark:bg-[#0a0e25]"
                                    >
                                        <img
                                            src={photo.photo_url}
                                            alt={`Vehicle Photo ${index + 1}`}
                                            className="h-32 w-full object-cover hover:scale-105
                                                       transition-transform duration-200"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ================= Vehicle Info ================= */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailRow
                            label="Vehicle Number"
                            value={capitalizeWords(vehicle?.vehicle_number)}
                        />
                        <DetailRow
                            label="Model"
                            value={capitalizeWords(vehicle?.model)}
                        />
                        <DetailRow
                            label="Vehicle Make"
                            value={capitalizeWords(vehicle?.vehile_make?.name)}
                        />
                        <DetailRow
                            label="Vehicle Type"
                            value={capitalizeWords(replaceUnderscoreWithSpace(vehicle?.vehicle_type))}
                        />
                        <DetailRow
                            label="Year"
                            value={vehicle?.vehicle_year}
                        />
                        <DetailRow
                            label="Fuel Type"
                            value={capitalizeWords(vehicle?.fuel_type)}
                        />
                        <DetailRow
                            label="Transmission"
                            value={capitalizeWords(vehicle?.transmission)}
                        />
                        <DetailRow
                            label="Mileage"
                            value={vehicle?.mileage}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
}

/* ================= Detail Row ================= */
function DetailRow({ label, value }) {
    return (
        <div
            className="flex justify-between items-center
                       bg-gray-100 dark:bg-[#1b214a]
                       rounded-md px-3 py-2
                       text-gray-700 dark:text-gray-300"
        >
            <span className="font-medium text-gray-600 dark:text-gray-400">
                {label}:
            </span>
            <span className="text-right">
                {value || "--"}
            </span>
        </div>
    );
}
