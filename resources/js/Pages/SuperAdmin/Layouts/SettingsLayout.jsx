import NavDropdown from "@/Components/NavDropdown";
import NavLink from "@/Components/NavLink";
import { AiOutlineProduct } from "react-icons/ai";
import { CiShop } from "react-icons/ci";
import { GiSwordBrandish } from "react-icons/gi";
import { PiStudentBold } from "react-icons/pi";
import { TbCategory } from "react-icons/tb";


export default function SettingsLayout() {
    return (
        <div>
            <div className="pb-[5px] pt-[5px] sm:px-4 px-3 w-full flex flex-row items-center justify-start gap-2 bg-white dark:bg-[#0a0e25] border-b border-gray-300 dark:border-blue-950 overflow-x-auto whitespace-nowrap">
                <div className="flex-shrink-0 inline-flex">
                    <NavLink
                        href={'superadmin.settings.vehicle.make.list'}
                        active={route().current("category")}
                    >
                        <GiSwordBrandish className="h-5 w-5 mr-2" /> Vehicle Make
                    </NavLink>
                </div>
            </div>
        </div>
    );
}
