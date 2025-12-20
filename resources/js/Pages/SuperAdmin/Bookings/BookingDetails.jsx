import { useState } from "react";
import Modal from "@/Components/Modal";
import RoundBtn from "@/Components/RoundBtn";
import { HiInformationCircle } from "react-icons/hi";
import { useHelpers } from "@/Components/Helpers";

export default function BookingDetails({ booking }) {
    console.log('booking', booking);
    const [open, setOpen] = useState(false);
    const { displayInRupee, capitalizeWords } = useHelpers();


    const closeModal = () => setOpen(false);

    return (
        <>
            <RoundBtn onClick={() => setOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-400"
            >
                <HiInformationCircle />
                <span>Details</span>
            </RoundBtn>

            <Modal show={open} maxWidth="3xl" topCloseButton={true} handleTopClose={closeModal}>
                <div className="bg-gray-200 dark:bg-[#131836] px-6 py-3 border-b">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                        Booking Details – {booking.booking_id}
                    </h3>
                </div>

                <div className="p-6 bg-gray-100 dark:bg-[#0a0e25] text-black dark:text-white space-y-6">

                    {/* BASIC INFO */}
                    <section>
                        <h4 className="font-semibold text-md border-b pb-2 border-gray-300 dark:border-blue-950">
                            Basic Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                            <Info label="Booking Date" value={booking.date} />
                            <Info label="Time" value={booking.time} />
                            <Info label="Status" value={capitalizeWords(booking.booking_status)} />
                            {booking.mechanic_job?.status == "rejected" ? <>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Reject Reason</p>
                                    <p className="font-medium text-red-400">{capitalizeWords(booking?.mechanic_job?.rejection_reason) || '--'}</p>
                                </div>
                            </> : ''}
                            <Info label="Pickup Type" value={capitalizeWords(booking.pickup_type)} />
                        </div>
                    </section>


                    {/* MECHANIC */}
                    <section>
                        <h4 className="font-semibold text-md border-b pb-2 border-gray-300 dark:border-blue-950">
                            Assigned Garage Details
                        </h4>
                        {booking?.garage ? (
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{capitalizeWords(booking?.garage?.name) || '--'}</p>
                                    <p className="font-medium">{capitalizeWords(booking?.garage?.address) || '--'} - {booking?.garage?.pincode || '--'}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-red-400 mt-2">No garage assigned.</p>
                        )}
                    </section>

                    {/* VEHICLE */}
                    <section>
                        <h4 className="font-semibold text-md border-b pb-2 border-gray-300 dark:border-blue-950">
                            Vehicle Details
                        </h4>

                        <div className="grid grid-cols-2 gap-4 mt-3">
                            <Info label="Type" value={capitalizeWords(booking.vehicle?.vehicle_type)} />
                            <Info label="Vehicle No" value={booking.vehicle?.vehicle_number} />
                            <Info label="Make" value={capitalizeWords(booking.vehicle?.vehile_make?.name)} />
                            <Info label="Model" value={capitalizeWords(booking.vehicle?.model)} />
                            <Info label="Fuel" value={capitalizeWords(booking.vehicle?.fuel_type)} />
                        </div>

                        {/* Vehicle Photos */}
                        <div className="flex gap-3 mt-4">
                            {booking.vehicle?.vehicle_photos?.map((img, i) => (
                                <img
                                    key={i}
                                    src={img.photo_url}
                                    alt="vehicle"
                                    className="w-24 h-24 rounded-md object-cover border"
                                />
                            ))}
                        </div>
                    </section>

                    {/* PICKUP / DROP */}
                    <section>
                        <h4 className="font-semibold text-md border-b pb-2 border-gray-300 dark:border-blue-950">
                            Pickup & Drop
                        </h4>

                        <div className="grid grid-cols-2 gap-4 mt-3">
                            {booking.pickup_address ? <>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Pickup Address</p>
                                    <p className="font-medium">{capitalizeWords(booking.pickup_address?.address) || '--'} - {booking.pickup_address?.pincode || '--'}</p>
                                </div>
                            </> : <>
                                <span className="text-red-500 text-sm">Pickup address does not exist</span>
                            </>}

                            {booking.drop_address ? <>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Drop Address</p>
                                    <p className="font-medium">{capitalizeWords(booking.drop_address?.address) || '--'} - {booking.drop_address?.pincode || '--'}</p>
                                </div>
                            </> : <>
                                <span className="text-red-500 text-sm">Pickup address does not exist</span>
                            </>}
                        </div>
                    </section>

                    {/* SERVICES */}
                    <section>
                        <h4 className="font-semibold text-md border-b pb-2 border-gray-300 dark:border-blue-950">
                            Services
                        </h4>

                        <ul className="mt-3 space-y-2 list-disc pl-5">
                            {booking.services?.map((s) => (
                                <li key={s.id}>
                                    {capitalizeWords(s.service_type?.name)} — {displayInRupee(s.service_type?.base_price)}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* EXTRA SERVICES */}
                    {booking.extra_services?.length > 0 && (
                        <section>
                            <h4 className="font-semibold text-md border-b pb-2 border-gray-300 dark:border-blue-950">
                                Extra Services
                            </h4>

                            <ul className="mt-3 space-y-2 list-disc pl-5">
                                {booking.extra_services.map((ser, i) => (
                                    <li key={i}>{capitalizeWords(ser)}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* NOTES */}
                    {booking.additional_note && (
                        <section>
                            <h4 className="font-semibold text-md border-b pb-2 border-gray-300 dark:border-blue-950">
                                Additional Notes
                            </h4>
                            <p className="mt-2 text-sm">{capitalizeWords(booking.additional_note)}</p>
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
