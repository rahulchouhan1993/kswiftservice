import { useState } from "react";
import Modal from "@/Components/Modal";
import RoundBtn from "@/Components/RoundBtn";
import { MdOutlineInsertPhoto, MdOutlineVideoLibrary } from "react-icons/md";

export default function ServiceProofModal({ service }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <RoundBtn onClick={() => setOpen(true)}>
                {service?.photo_url ? (<>
                    <MdOutlineVideoLibrary />
                </>) : (<>
                    <MdOutlineInsertPhoto />
                </>)}
            </RoundBtn>

            <Modal
                show={open}
                maxWidth="md"
                topCloseButton
                handleTopClose={() => setOpen(false)}
            >
                <h3 className="px-6 py-3 border-b bg-gray-200 dark:bg-[#131836] font-semibold text-lg dark:text-white">
                    Service Proof
                </h3>

                <div className="p-6 dark:bg-[#0a0e25] max-h-[70vh] overflow-y-auto">

                    {/* 🎥 Video */}
                    {service?.video_url ? (
                        <video
                            src={service.video_url}
                            controls
                            className="w-full rounded-lg"
                        />
                    ) : service?.photo_url ? (
                        <img
                            src={service.photo_url}
                            alt="Service Proof"
                            className="w-full rounded-lg object-contain"
                        />
                    ) : (
                        <p className="text-center text-sm text-gray-500">
                            No service proof available.
                        </p>
                    )}

                </div>
            </Modal>
        </>
    );
}
