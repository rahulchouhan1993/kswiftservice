import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import ProductModal from "../Pages/SuperAdmin/Order/ProductModal";

export default function ProductDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const products = ["PVC ID Card", "Smart Card", "Lanyard", "Card Holder"];

    const filteredProducts = products.filter((p) =>
        p.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Product
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="mt-1 w-full flex items-center justify-between px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0a0e37] text-gray-800 dark:text-white shadow-sm focus:outline-none"
            >
                {selectedProduct || "Select a product"}{" "}
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
                                No products found.
                            </li>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(true);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-5 py-2 border border-t border-gray-300 dark:border-blue-950 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#0a0e27] rounded-lg"
                        >
                            <p className="text-gray-600 dark:text-gray-200">
                                Add Product...
                            </p>
                            <IoMdAddCircle className="text-xl" />
                        </button>
                    </ul>
                </div>
            )}

            {/* Modal */}
            <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
