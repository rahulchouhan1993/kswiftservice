import { FaMinus, FaSlash } from "react-icons/fa";
import { BsSlashLg } from "react-icons/bs";
import { MdTimeline } from "react-icons/md";
import { FaWaveSquare } from "react-icons/fa6";
import { CgShapeHalfCircle } from "react-icons/cg";

export default function LineComponent({ 
  elements, 
  setElements, 
  setSelectedId, 
  successAlert 
}) {
  
  const addLine = (lineType) => {
    const id = Date.now();
    let newLine = {
      id,
      type: 'line',
      lineType,
      x: 50,
      y: 50,
      width: 100,
      height: lineType === 'horizontal' ? 2 : 100,
      stroke: '#000',
      strokeWidth: 1,
      opacity: 1,
      rotation: 0
    };

    // Adjust dimensions based on line type
    switch (lineType) {
      case 'horizontal':
        newLine.height = 2;
        break;
      case 'vertical':
        newLine.width = 2;
        break;
      case 'diagonal':
        newLine.width = 100;
        newLine.height = 100;
        break;
      case 'curve':
        newLine.width = 100;
        newLine.height = 50;
        break;
      case 'zigzag':
        newLine.width = 120;
        newLine.height = 40;
        break;
    }

    setElements(prev => [...prev, newLine]);
    setSelectedId(id);
    successAlert(`${lineType} line added!`);
  };

  return (
    <div className="pt-12 -translate-y-[48px]">
      <div 
        onClick={() => addLine('horizontal')}
        className="p-2  dark:border-blue-700  cursor-pointer dark:hover:bg-blue-700 hover:bg-gray-200 px-4 py-3"
        title="Horizontal Line"
      >
        <FaMinus />
      </div>
      
      <div 
        onClick={() => addLine('vertical')}
        className="p-2  dark:border-blue-700  cursor-pointer dark:hover:bg-blue-700 hover:bg-gray-200 px-4 py-3"
        title="Vertical Line"
      >
        <BsSlashLg style={{ transform: 'rotate(90deg)' }} />
      </div>
      
      <div 
        onClick={() => addLine('diagonal')}
        className="p-2  dark:border-blue-700  cursor-pointer dark:hover:bg-blue-700 hover:bg-gray-200 px-4 py-3"
        title="Diagonal Line"
      >
        <FaSlash />
      </div>
      
      <div 
        onClick={() => addLine('curve')}
        className="p-2  dark:border-blue-700  cursor-pointer dark:hover:bg-blue-700 hover:bg-gray-200 px-4 py-3"
        title="Curve Line"
      >
        <CgShapeHalfCircle />
      </div>
      
      <div 
        onClick={() => addLine('zigzag')}
        className="p-2  dark:border-blue-700  cursor-pointer dark:hover:bg-blue-700 hover:bg-gray-200 px-4 py-3"
        title="Zigzag Line"
      >
        <MdTimeline />
      </div>
    </div>
  );
}