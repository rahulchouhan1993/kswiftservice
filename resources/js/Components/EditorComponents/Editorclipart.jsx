import { Minus, Square, Star, Circle, Triangle, Diamond, Hexagon } from "lucide-react";
import { FaShapes } from "react-icons/fa6";
import { BsFillOctagonFill } from "react-icons/bs";

export default function Editorclipart({ addClipart }) {

  return (
    <div>
      {/* Clipart */}
      <div className="flex flex-col gap-2 w-full p-1">
        <div className="flex flex-col gap-2 items-start p-1 w-full  rounded-md">
          {/* Header */}
          <h3
            className="font-bold text-lg text-gray-700 dark:text-gray-200 flex items-center gap-2 cursor-pointer select-none ">
            <FaShapes /> Add Clipart
          </h3>


          <div className="grid grid-cols-3 gap-3 mt-3 animate-fadeIn">
            {/* Square */}
            <button
              onClick={() => addClipart("square")}
              className="flex flex-col items-center justify-center size-[90px] rounded-2xl
      bg-gradient-to-br from-blue-500 to-blue-600 text-white border border-blue-400
      shadow-md hover:shadow-xl hover:from-blue-600 hover:to-blue-700
      active:scale-95 transition-all duration-300"
            >
              <Square size={38} />
              <span className="text-xs mt-1">Square</span>
            </button>

            {/* Circle */}
            <button
              onClick={() => addClipart("circle")}
              className="flex flex-col items-center justify-center size-[90px] rounded-2xl 
      bg-gradient-to-br from-green-500 to-green-600 text-white border border-green-400
      shadow-md hover:shadow-xl hover:from-green-600 hover:to-green-700
      active:scale-95 transition-all duration-300"
            >
              <Circle size={38} />
              <span className="text-xs mt-1">Circle</span>
            </button>

            {/* Triangle */}
            <button
              onClick={() => addClipart("triangle")}
              className="flex flex-col items-center justify-center size-[90px] rounded-2xl 
      bg-gradient-to-br from-red-500 to-red-600 text-white border border-red-400
      shadow-md hover:shadow-xl hover:from-red-600 hover:to-red-700
      active:scale-95 transition-all duration-300"
            >
              <Triangle size={38} />
              <span className="text-xs mt-1">Triangle</span>
            </button>

            {/* Star */}
            <button
              onClick={() => addClipart("star")}
              className="flex flex-col items-center justify-center size-[90px] rounded-2xl 
      bg-gradient-to-br from-yellow-400 to-yellow-500 text-white border border-yellow-300
      shadow-md hover:shadow-xl hover:from-yellow-500 hover:to-yellow-600
      active:scale-95 transition-all duration-300"
            >
              <Star size={38} />
              <span className="text-xs mt-1">Star</span>
            </button>

            {/* Diamond */}
            <button
              onClick={() => addClipart("diamond")}
              className="flex flex-col items-center justify-center size-[90px] rounded-2xl 
      bg-gradient-to-br from-purple-500 to-purple-600 text-white border border-purple-400
      shadow-md hover:shadow-xl hover:from-purple-600 hover:to-purple-700
      active:scale-95 transition-all duration-300"
            >
              <Diamond size={38} />
              <span className="text-xs mt-1">Diamond</span>
            </button>

            {/* Pentagon */}
            <button
              onClick={() => addClipart("pentagon")}
              className="flex flex-col items-center justify-center size-[90px] rounded-2xl 
      bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border border-indigo-400
      shadow-md hover:shadow-xl hover:from-indigo-600 hover:to-indigo-700
      active:scale-95 transition-all duration-300"
            >
              <Hexagon size={38} />
              <span className="text-xs mt-1">Pentagon</span>
            </button>

            {/* Hexagon */}
            <button
              onClick={() => addClipart("hexagon")}
              className="flex flex-col items-center justify-center size-[90px] rounded-2xl 
      bg-gradient-to-br from-teal-500 to-teal-600 text-white border border-teal-400
      shadow-md hover:shadow-xl hover:from-teal-600 hover:to-teal-700
      active:scale-95 transition-all duration-300"
            >
              <Hexagon size={38} />
              <span className="text-xs mt-1">Hexagon</span>
            </button>



            {/* Octagon */}
            <button
              onClick={() => addClipart("octagon")}
              className="flex flex-col items-center justify-center size-[90px] rounded-2xl 
      bg-gradient-to-br from-pink-500 to-pink-600 text-white border border-pink-400
      shadow-md hover:shadow-xl hover:from-pink-600 hover:to-pink-700
      active:scale-95 transition-all duration-300"
            >
              <BsFillOctagonFill size={38} />
              <span className="text-xs mt-1">Octagon</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}