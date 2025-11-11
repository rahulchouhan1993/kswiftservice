import { FaMinus, FaSlash, FaWaveSquare } from "react-icons/fa";
import { BsSlashLg } from "react-icons/bs";
import { MdTimeline } from "react-icons/md";

export default function LineTypes({ 
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
      strokeWidth: 2,
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

  const lineTypes = [
    { type: 'horizontal', icon: FaMinus, label: 'Horizontal' },
    { type: 'vertical', icon: BsSlashLg, label: 'Vertical' },
    { type: 'diagonal', icon: FaSlash, label: 'Diagonal' },
    { type: 'curve', icon: MdTimeline, label: 'Curve' },
    { type: 'zigzag', icon: FaWaveSquare, label: 'Zigzag' }
  ];

  return (
    <div className="absolute left-full top-0 ml-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50">
      <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Line Types</h4>
      <div className="grid grid-cols-1 gap-1">
        {lineTypes.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => addLine(type)}
            className="flex items-center gap-2 p-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title={label}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}