import { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import { FaPlusCircle, FaUndo, FaWarehouse } from "react-icons/fa";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import RoundBtn from "@/Components/RoundBtn";
import axios from "axios";
import { useHelpers } from "@/Components/Helpers";
import TextAreaWithCount from "@/Components/TextAreaWithCount";

export default function AssignGarage({ booking }) {
    console.log('booking', booking);
    const [open, setOpen] = useState(false);
    const [garages, setGarages] = useState([]);
    const [allGarages, setAllGarages] = useState([]);

    const pickupPincode = booking?.pickup_address?.pincode;
    const dropPincode = booking?.drop_address?.pincode;

    const { capitalizeWords } = useHelpers();

    const { data, setData, post, reset, processing } = useForm({
        uuid: booking?.uuid,
        booking_id: booking?.id,
        search_type: booking?.pickup_address ? "at_pickup_location" : "all",
        pincode: "",
        garage_id: booking?.garage?.id || "",
        reason: "",
        mechanic_job_id: booking?.mechanic_job?.id || "",
    });

    useEffect(() => {
        setData("garage_id", "");
    }, [data.search_type]);

    useEffect(() => {
        if (open) fetchGarages();
    }, [open, data.search_type]);

    useEffect(() => {
        if (data.search_type === "all") {
            if (!data.pincode) {
                setGarages(allGarages);
            } else {
                const filtered = allGarages.filter((g) =>
                    g?.pincode?.toString().startsWith(data.pincode.toString())
                );
                setGarages(filtered);
            }
        }
    }, [data.pincode, data.search_type]);

    const fetchGarages = async () => {
        try {
            let response;

            if (data.search_type === "at_pickup_location") {
                response = await axios.get(route("common.search.garage"), {
                    params: { pincode: pickupPincode, type: data.search_type },
                });
            } else if (data.search_type === "at_drop_location") {
                response = await axios.get(route("common.search.garage"), {
                    params: { pincode: dropPincode, type: data.search_type },
                });
            } else {
                response = await axios.get(route("common.search.garage"), {
                    params: { type: "all" },
                });
                setAllGarages(response.data.garages || []);
            }

            setGarages(response.data.garages || []);
        } catch (error) {
            console.log(error);
        }
    };

    const closeModal = () => {
        setOpen(false);
        reset();
        setGarages([]);
        setAllGarages([]);
    };

    const searchOptions = [
        { value: "all", label: "All Garages" },
        { value: "at_pickup_location", label: "Garage at Pickup Location" },
        { value: "at_drop_location", label: "Garage at Drop Location" },
    ];

    const handleAssignSubmit = (e) => {
        e.preventDefault();
        post(route("superadmin.booking.assign.mechanic"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const handleCancelSubmit = (e) => {
        e.preventDefault();
        post(route("superadmin.booking.cancel.assign.mechanic", { uuid: data.uuid }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    /**
     * IMPORTANT LOGIC UPDATE:
     * Show Cancel UI only when booking has assigned garage
     * AND mechanic_job.status is pending | accepted | rejected
     */
    const showCancelUI =
        booking?.garage &&
        booking?.mechanic_job &&
        ["pending", "accepted", "rejected"].includes(booking?.mechanic_job?.status);

    return (
        <>
            <RoundBtn onClick={() => setOpen(true)}>
                <FaWarehouse />
            </RoundBtn>

            <Modal show={open} maxWidth="lg" topCloseButton={true} handleTopClose={closeModal}>
                <h3 className="px-6 py-2 border-b bg-gray-200 dark:bg-[#131836] font-semibold text-lg">
                    Assign Garage
                </h3>

                <section className="px-6 pt-4 pb-3 bg-gray-50 dark:bg-[#0f1633] border-b">
                    <h4 className="font-semibold text-md pb-2">Pickup & Drop Information</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">

                        <div className="p-3 rounded-lg bg-white dark:bg-[#131b3a] border shadow-sm">
                            <p className="text-xs text-gray-500">Pickup Address</p>
                            <p className="font-medium text-sm mt-1">
                                {capitalizeWords(booking.pickup_address?.address) || "--"} - {pickupPincode}
                            </p>
                        </div>

                        <div className="p-3 rounded-lg bg-white dark:bg-[#131b3a] border shadow-sm">
                            <p className="text-xs text-gray-500">Drop Address</p>
                            <p className="font-medium text-sm mt-1">
                                {capitalizeWords(booking.drop_address?.address) || "--"} - {dropPincode}
                            </p>
                        </div>
                    </div>
                </section>

                {showCancelUI ? (<>
                    <h3 className="px-6 py-1 border-b bg-gray-200 dark:bg-[#131836] font-semibold text-md">
                        Assigned Garage
                    </h3>
                    <form onSubmit={handleCancelSubmit} className="px-6 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
                        <div className="p-3 my-2 border rounded-lg dark:bg-[#131b3a]">
                            <p className="font-semibold">{capitalizeWords(booking.garage.name)}</p>
                            <p className="text-sm">{booking.garage.phone}</p>
                            <p className="text-xs mt-1 opacity-75">
                                {booking.garage.address} - {booking.garage.pincode}
                            </p>
                        </div>

                        {booking?.booking_status == 'accepted' ? <>
                            <span className="mt-3 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded px-3 py-1">Work in progress..</span>
                        </> : <>
                            <TextAreaWithCount
                                name="reason"
                                value={data.reason}
                                onChange={(e) => setData("reason", e.target.value)}
                                required
                                placeholder="Cancellation reason..."
                            />

                            <div className="border-t pt-3 flex justify-end gap-3">
                                <SecondaryButton type="submit" disabled={processing}>
                                    <FaUndo /> {processing ? "Cancelling..." : "Cancel Request"}
                                </SecondaryButton>
                            </div>

                        </>}
                    </form>
                </>
                ) : (
                    <form onSubmit={handleAssignSubmit} className="px-6 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
                        <div>
                            <label className="text-sm font-semibold">Search Garage</label>
                            <SelectInput
                                value={data.search_type}
                                onChange={(e) => setData("search_type", e.target.value)}
                                options={searchOptions}
                            />
                        </div>

                        {data.search_type === "all" && (
                            <div>
                                <label className="text-sm font-semibold">Filter by Pincode</label>
                                <input
                                    type="number"
                                    value={data.pincode}
                                    onChange={(e) => setData("pincode", e.target.value)}
                                    placeholder="Enter pincode..."
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-[#0a0e25]"
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-semibold mb-2 block">Select Garage</label>

                            {garages.length === 0 ? (
                                <p className="text-gray-500">No garages found.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {garages.map((g) => (
                                        <label
                                            key={g.id}
                                            className={`rounded-xl border p-4 shadow-sm cursor-pointer
                                                ${data.garage_id == g.id
                                                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0f1633]"
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <input
                                                    type="radio"
                                                    name="garage_id"
                                                    value={g.id}
                                                    checked={data.garage_id == g.id}
                                                    onChange={() => setData("garage_id", g.id)}
                                                    className="mt-1 h-5 w-5 text-blue-600"
                                                />

                                                <div>
                                                    <p className="font-semibold">{capitalizeWords(g.name)}</p>
                                                    <p className="text-sm opacity-75">{g.mobile}</p>
                                                    <p className="text-xs mt-1 opacity-75">
                                                        {g.address} - {g.pincode}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t pt-3 flex justify-end gap-3">
                            <SecondaryButton type="button" onClick={closeModal}>
                                <FaUndo /> Close
                            </SecondaryButton>

                            <PrimaryButton type="submit" disabled={processing}>
                                <FaPlusCircle /> {processing ? "Assigning..." : "Assign Garage"}
                            </PrimaryButton>
                        </div>
                    </form>
                )}
            </Modal>
        </>
    );
}
