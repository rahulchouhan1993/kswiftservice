// components/StatusTooltip.jsx
import { useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function StatusTooltip({
    anchorRef,
    show,
}) {
    const tooltipRef = useRef(null);
    const [style, setStyle] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (anchorRef.current && tooltipRef.current && show) {
            const rect = anchorRef.current.getBoundingClientRect();
            const tooltip = tooltipRef.current;

            setStyle({
                top: rect.bottom + window.scrollY + 8, // position below
                left:
                    rect.left +
                    window.scrollX +
                    rect.width / 2 -
                    tooltip.offsetWidth / 2,
            });
        }
    }, [anchorRef, show]);

    if (!show) return null;

    return (
        <div
            ref={tooltipRef}
            className="fixed min-w-fit z-[9999] bg-white dark:bg-gray-800 text-gray-800 dark:text-white 
                       text-xs rounded shadow-lg border border-gray-300 dark:border-gray-600 
                       transition-opacity duration-200"
            style={style}
        >
            
                <div class="w-full justify-end items-start gap-8 inline-flex">
                    <div class="w-full flex-col justify-start items-start gap-8 inline-flex">
                        <div class="w-full  bg-white dark:bg-[#131836] rounded-xl flex-col justify-start items-start flex">
                            <div class="w-full flex-col justify-center items-center p-2">
                                <ol class="flex md:flex-row flex-col md:items-start items-center justify-between w-full md:gap-4 gap-2">
                                    <li class="group flex relative justify-start ">
                                        <div class="w-full mr-1 block z-10 flex flex-col items-center justify-start gap-1">
                                            <div class="justify-center items-center gap-1.5 inline-flex">
                                                <h5 class="text-center whitespace-nowrap text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal">
                                                    Oder Placed
                                                </h5>
                                                <FaCheckCircle className="text-green-600" />
                                            </div>
                                            <h6 class="text-center text-gray-500  text-xs text-base font-normal leading-relaxed">
                                                20 May, 2024
                                            </h6>
                                        </div>
                                    </li>

                                    <li class="group flex relative justify-start  ">
                                        <div class="w-full mr-1 block z-10 flex flex-col items-center justify-start gap-1">
                                            <div class="justify-center items-center gap-1.5 inline-flex ">
                                                <h5 class="text-center  text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal">
                                                    Picked
                                                </h5>
                                                <FaCheckCircle className="text-green-600" />
                                            </div>
                                            <h6 class="text-center text-gray-500  text-xs text-base font-normal leading-relaxed">
                                                22 May, 2024
                                            </h6>
                                        </div>
                                    </li>
                                    <li class="group flex relative justify-start ">
                                        <div class="w-full mr-1 block z-10 flex flex-col items-center justify-start gap-1">
                                            <div class="justify-center items-center gap-1.5 inline-flex">
                                                <h5 class="text-center text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal whitespace-nowrap">
                                                    Oder Shipped
                                                </h5>
                                                <FaCheckCircle className="text-green-600" />
                                            </div>
                                            <h6 class="text-center text-gray-500  text-xs text-base font-normal leading-relaxed">
                                                28 May, 2024
                                            </h6>
                                        </div>
                                    </li>
                                    <li class="group flex relative justify-start">
                                        <div class="w-full block z-10 flex flex-col items-center justify-start gap-1">
                                            <div class="justify-center items-center gap-1.5 inline-flex">
                                                <h5 class="text-center text-gray-500 dark:text-gray-200 text-sm font-medium leading-normal">
                                                    Oder Delivered
                                                </h5>
                                            </div>
                                            <h6 class="text-center text-gray-500  text-xs text-base font-normal leading-relaxed">
                                                2 Jun, 2024
                                            </h6>
                                        </div>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            
        </div>
    );
}
