import { useState } from "react";
import Modal from "@/Components/Modal";
import RoundBtn from "@/Components/RoundBtn";
import { HiInformationCircle } from "react-icons/hi";
import { useHelpers } from "@/Components/Helpers";
import ServiceProofModal from "./ServiceProofModal";

export default function BookingDetails({ booking }) {
    console.log('booking', booking);
    const [open, setOpen] = useState(false);
    const { displayInRupee, capitalizeWords } = useHelpers();
    const closeModal = () => setOpen(false);

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
            <RoundBtn onClick={() => setOpen(true)}
            >
                <HiInformationCircle />
                <span>Booking Details</span>
            </RoundBtn>

            <Modal show={open} maxWidth="2xl" topCloseButton={true} handleTopClose={closeModal}>
                {/* Header */}
                <div className="px-6 py-4 border-b bg-gray-100 dark:bg-[#131836] flex justify-between items-center">
                    <div className="space-y-2">
                        {/* Booking Title */}
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                            Booking #{booking.booking_id}
                        </h3>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>
                                {booking.date} • {booking.time}
                            </span>

                            {/* Rating */}
                            <div className="flex items-center gap-1">
                                <span className="text-gray-600 dark:text-gray-300">
                                    Rating:
                                </span>
                                {renderStars(booking?.review?.review || 0)}
                            </div>

                            {/* Status Badge */}
                            <span className="px-3 py-1 rounded-full text-xs font-semibold
            bg-blue-100 text-blue-700
            dark:bg-blue-900/40 dark:text-blue-300">
                                {capitalizeWords(booking.booking_status)}
                            </span>
                        </div>
                    </div>

                </div>

                {/* Body */}
                <div className="p-6 bg-gray-50 dark:bg-[#0a0e25] text-black dark:text-white space-y-6">

                    {/* BASIC INFO */}
                    <section className="bg-white dark:bg-[#0f1435] rounded-xl p-5 border border-gray-200 dark:border-blue-950">
                        <h4 className="font-semibold text-sm uppercase text-gray-600 dark:text-gray-300 mb-4">
                            Basic Information
                        </h4>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Info label="Pickup Type" value={capitalizeWords(booking.pickup_type)} />
                            <Info label="Status" value={capitalizeWords(booking.booking_status)} />

                            {booking.mechanic_job?.status === "rejected" && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Reject Reason</p>
                                    <p className="font-medium text-red-500">
                                        {capitalizeWords(booking.mechanic_job?.rejection_reason) || "--"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* GARAGE */}
                    <section className="bg-white dark:bg-[#0f1435] rounded-xl p-5 border border-gray-200 dark:border-blue-950">
                        <h4 className="font-semibold text-sm uppercase text-gray-600 dark:text-gray-300 mb-4">
                            Assigned Garage
                        </h4>

                        {booking?.garage ? (
                            <div>
                                <p className="font-semibold">
                                    {capitalizeWords(booking.garage.name)}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {capitalizeWords(booking.garage.address)} – {booking.garage.pincode}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-red-500">No garage assigned</p>
                        )}
                    </section>

                    {/* VEHICLE */}
                    <section className="bg-white dark:bg-[#0f1435] rounded-xl p-5 border border-gray-200 dark:border-blue-950">
                        <h4 className="font-semibold text-sm uppercase text-gray-600 dark:text-gray-300 mb-4">
                            Vehicle Details
                        </h4>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Info label="Type" value={capitalizeWords(booking.vehicle?.vehicle_type)} />
                            <Info label="Vehicle No" value={booking.vehicle?.vehicle_number} />
                            <Info label="Make" value={capitalizeWords(booking.vehicle?.vehile_make?.name)} />
                            <Info label="Model" value={capitalizeWords(booking.vehicle?.model)} />
                            <Info label="Fuel" value={capitalizeWords(booking.vehicle?.fuel_type)} />
                        </div>

                        {booking.vehicle?.vehicle_photos?.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                                {booking.vehicle.vehicle_photos.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img.photo_url}
                                        className="w-full h-24 object-cover rounded-lg border shadow-sm hover:scale-105 transition"
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* PICKUP / DROP */}
                    <section className="bg-white dark:bg-[#0f1435] rounded-xl p-5 border border-gray-200 dark:border-blue-950">
                        <h4 className="font-semibold text-sm uppercase text-gray-600 dark:text-gray-300 mb-4">
                            Pickup & Drop
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {booking.pickup_address ? (
                                <Info
                                    label="Pickup Address"
                                    value={`${capitalizeWords(booking.pickup_address.address)} - ${booking.pickup_address.pincode}`}
                                />
                            ) : (
                                <p className="text-sm text-red-500">Pickup address missing</p>
                            )}

                            {booking.drop_address ? (
                                <Info
                                    label="Drop Address"
                                    value={`${capitalizeWords(booking.drop_address.address)} - ${booking.drop_address.pincode}`}
                                />
                            ) : (
                                <p className="text-sm text-red-500">Drop address missing</p>
                            )}
                        </div>
                    </section>

                    {/* SERVICES */}
                    <section className="bg-white dark:bg-[#0f1435] rounded-xl p-5 border border-gray-200 dark:border-blue-950">
                        <h4 className="font-semibold text-sm uppercase text-gray-600 dark:text-gray-300 mb-4">
                            Services
                        </h4>

                        <ul className="space-y-3">
                            {booking.services?.map((s) => (
                                <li
                                    key={s.id}
                                    className="flex items-center justify-between text-sm border-b border-dashed pb-2"
                                >
                                    {/* Service Name */}
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {capitalizeWords(s.service_type?.name || '—')}
                                    </span>

                                    {/* Price + Proof */}
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {displayInRupee(s.service_type?.base_price || 0)}
                                        </span>

                                        {s?.photo_url || s?.video_url ? (<>
                                            <ServiceProofModal service={s} />
                                        </>) : ''}
                                    </div>
                                </li>
                            ))}
                        </ul>

                    </section>

                    {/* EXTRA SERVICES */}
                    {booking.extra_services?.length > 0 && (
                        <section className="bg-white dark:bg-[#0f1435] rounded-xl p-5 border border-gray-200 dark:border-blue-950">
                            <h4 className="font-semibold text-sm uppercase text-gray-600 dark:text-gray-300 mb-4">
                                Extra Services
                            </h4>

                            <div className="flex flex-wrap gap-2">
                                {booking.extra_services.map((ser, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-full text-xs bg-gray-200 dark:bg-blue-900/40"
                                    >
                                        {capitalizeWords(ser)}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* NOTES */}
                    {booking.additional_note && (
                        <section className="bg-white dark:bg-[#0f1435] rounded-xl p-5 border border-gray-200 dark:border-blue-950">
                            <h4 className="font-semibold text-sm uppercase text-gray-600 dark:text-gray-300 mb-4">
                                Additional Notes
                            </h4>
                            <p className="text-sm">
                                {capitalizeWords(booking.additional_note)}
                            </p>
                        </section>
                    )}
                </div>
            </Modal>

        </>
    );
}

// Small reusable info component
const Info = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium">{value || "--"}</p>
    </div>
);
