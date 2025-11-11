import { React, useState } from "react";
import AddPartyModal from "@/Pages/SuperAdmin/Order/AddParty";
import { FaChevronDown } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";

export default function PartyDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const products = ["Party 1", "Party 2", "Party 3", "Party 4"];

     const filteredProducts = products.filter((p) =>
        p.toLowerCase().includes(searchTerm.toLowerCase())
    );

    

    return (
        <div className="relative w-1/2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Select Party
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between mt-1 w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0a0e37] text-gray-800 dark:text-white shadow-sm focus:outline-none"
            >
                {selectedProduct || "Select Party"}{" "}
                <FaChevronDown className="text-gray-500 text-sm" />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#0a0e37] border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-64 overflow-y-auto">
                    <div className="p-2">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search product..."
                            className="w-full px-3 py-1 rounded-md border border-gray-300 dark:border-blue-950 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-[#0a0e37] dark:text-white"
                        />
                    </div>
                    <ul className="px-2 pb-2">
                        {filteredProducts.map((product, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setIsOpen(false);
                                }}
                                className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#0a0e27] text-sm text-gray-800 dark:text-white"
                            >
                                {product}
                            </li>
                        ))}
                        {filteredProducts.length === 0 && (
                            <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                No Party found.
                            </li>
                        )}
                        <div>
                            {/* Add Button */}
                            <button
                                onClick={() => {
                                setIsModalOpen(true);
                                setIsOpen(false);
                            }}
                                className="w-full mt-1 flex items-center justify-between px-5 py-2 border border-gray-300 rounded-lg dark:border-blue-950 hover:bg-gray-200 dark:hover:bg-[#0a0e27]"
                            >
                                <p className="text-gray-600 dark:text-gray-200">
                                    Add Party...
                                </p>
                                <IoMdAddCircle className="text-xl" />
                            </button>

                            {/* Modal */}
                            <AddPartyModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                            />
                        </div>
                    </ul>
                </div>
            )}
        </div>
    );
}
