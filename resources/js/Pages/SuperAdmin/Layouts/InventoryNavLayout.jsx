import NavDropdown from "@/Components/NavDropdown";
import NavLink from "@/Components/NavLink";
import { AiOutlineProduct } from "react-icons/ai";
import { CiShop } from "react-icons/ci";
import { PiStudentBold } from "react-icons/pi";
import { TbCategory } from "react-icons/tb";


export default function InventoryNavLayout() {
    return (
        <div>
            <div className="pb-[5px] pt-[2px] sm:px-4 px-3 w-full flex flex-row items-center justify-start gap-2 bg-white dark:bg-[#0a0e25] border-b border-gray-300 dark:border-blue-950 overflow-x-auto whitespace-nowrap">
                <div className="flex-shrink-0 inline-flex">
                    <NavLink
                        href="#"
                        active={route().current("category")}
                    >
                        <TbCategory className="h-5 w-5 mr-2" /> Categories
                    </NavLink>
                </div>

                <div className="flex-shrink-0 inline-flex">
                    <NavLink
                        href="#"
                        active={route().current("subcategory")}
                    >
                        <AiOutlineProduct className="h-5 w-5 mr-2" /> Sub
                        Categories
                    </NavLink>
                </div>

                <div className="flex-shrink-0 inline-flex">
                    <NavLink
                        href="#"
                        active={route().current("product")}
                    >
                        <CiShop className="h-5 w-5 mr-2" /> Products
                    </NavLink>
                </div>
            </div>
        </div>
    );
}
