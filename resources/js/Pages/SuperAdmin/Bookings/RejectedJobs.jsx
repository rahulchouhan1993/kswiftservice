import { useState, useMemo } from "react";
import Modal from "@/Components/Modal";
import RoundBtn from "@/Components/RoundBtn";
import { BiSolidError } from "react-icons/bi";
import DataNotExist from "@/Components/DataNotExist";
import UserAvatarCard from "@/Components/UserAvatarCard";

export default function RejectedJobs({ list }) {
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    const jobs = useMemo(() => {
        if (Array.isArray(list)) return list;
        if (Array.isArray(list?.data)) return list.data;
        if (list && typeof list === "object") return [list];
        return [];
    }, [list]);

    return (
        <>
            {/* Button */}
            <RoundBtn
                onClick={() => setOpen(true)}
            >
                <BiSolidError />
                <span>Rejected By</span>
            </RoundBtn>

            {/* Modal */}
            <Modal
                show={open}
                maxWidth="4xl"
                topCloseButton={true}
                handleTopClose={closeModal}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b bg-gray-100 dark:bg-[#131836]">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                        Rejected By Mechanics
                    </h3>
                </div>

                {/* Body */}
                <div className="p-2 bg-gray-50 dark:bg-[#0a0e25] text-black dark:text-white">
                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-blue-900">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-[#0a0e25]">
                                <tr>
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                        Mechanic
                                    </th>
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                        Reason
                                    </th>
                                    <th className="px-3 py-2 text-xs font-semibold uppercase text-center">
                                        Rejected On
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-10 text-center">
                                            <DataNotExist />
                                        </td>
                                    </tr>
                                ) : (
                                    jobs.map((job, index) => (
                                        <tr
                                            key={job.id ?? index}
                                            className="border-b border-gray-200 dark:border-blue-900 hover:bg-gray-50 dark:hover:bg-[#12184a]"
                                        >
                                            {/* Mechanic */}
                                            <td className="px-3 py-2">
                                                <UserAvatarCard user={job.mechanic} />
                                            </td>

                                            {/* Rejection Reason */}
                                            <td className="px-3 py-2 text-center">
                                                {job.rejection_reason || "--"}
                                            </td>

                                            {/* Rejection Date */}
                                            <td className="px-3 py-2 text-center">
                                                {job.rejected_at ?? "--"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
        </>
    );
}
