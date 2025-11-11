import { MdFileUpload } from "react-icons/md";
import { FaShapes } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";
import { CiText } from "react-icons/ci";
import { FaTools } from "react-icons/fa";

export default function SidebarTabs({ activeTab, setActiveTab, hoveredTab, setHoveredTab, pinnedTab, setPinnedTab }) {
  return (
    <div className="flex flex-col w-12 h-full bg-gray-100 dark:bg-[#0a0e37] border-r dark:border-r-blue-800">
      <button
        onMouseEnter={() => {
          if (!pinnedTab) {
            setHoveredTab("upload");
          }
        }}
        onClick={() => {
          if (pinnedTab === "upload") {
            setPinnedTab(null);
          } else {
            setPinnedTab("upload");
          }
        }}
        className={`p-3 flex justify-center items-center transition-all duration-200 relative ${
          pinnedTab === "upload" || (!pinnedTab && hoveredTab === "upload") ? "bg-blue-500 text-white shadow-md" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        <MdFileUpload size={22} />
        {pinnedTab === "upload" && <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>}
      </button>

      <button
        onMouseEnter={() => {
          if (!pinnedTab) {
            setHoveredTab("controls");
          }
        }}
        onClick={() => {
          if (pinnedTab === "controls") {
            setPinnedTab(null);
          } else {
            setPinnedTab("controls");
          }
        }}
        className={`p-3 flex justify-center items-center transition-all duration-200 relative ${
          pinnedTab === "controls" || (!pinnedTab && hoveredTab === "controls") ? "bg-blue-500 text-white shadow-md" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        <LuLayoutDashboard size={22} />
        {pinnedTab === "controls" && <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>}
      </button>

      <button
        onMouseEnter={() => {
          if (!pinnedTab) {
            setHoveredTab("clipart");
          }
        }}
        onClick={() => {
          if (pinnedTab === "clipart") {
            setPinnedTab(null);
          } else {
            setPinnedTab("clipart");
          }
        }}
        className={`p-3 flex justify-center items-center transition-all duration-200 relative ${
          pinnedTab === "clipart" || (!pinnedTab && hoveredTab === "clipart") ? "bg-blue-500 text-white shadow-md" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        <FaShapes size={22} />
        {pinnedTab === "clipart" && <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>}
      </button>

      <button
        onMouseEnter={() => {
          if (!pinnedTab) {
            setHoveredTab("text");
          }
        }}
        onClick={() => {
          if (pinnedTab === "text") {
            setPinnedTab(null);
          } else {
            setPinnedTab("text");
          }
        }}
        className={`p-3 flex justify-center items-center transition-all duration-200 relative ${
          pinnedTab === "text" || (!pinnedTab && hoveredTab === "text") ? "bg-blue-500 text-white shadow-md" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        <CiText size={22} />
        {pinnedTab === "text" && <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>}
      </button>

      <button
        onMouseEnter={() => {
          if (!pinnedTab) {
            setHoveredTab("tools");
          }
        }}
        onClick={() => {
          if (pinnedTab === "tools") {
            setPinnedTab(null);
          } else {
            setPinnedTab("tools");
          }
        }}
        className={`p-3 flex justify-center items-center transition-all duration-200 relative ${
          pinnedTab === "tools" || (!pinnedTab && hoveredTab === "tools") ? "bg-blue-500 text-white shadow-md" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        <FaTools size={22} />
        {pinnedTab === "tools" && <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>}
      </button>
    </div>
  );
}