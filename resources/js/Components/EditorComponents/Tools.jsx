import { CiText } from "react-icons/ci";
import { FaCopy, FaPaste, FaUndo, FaRedo, FaAlignLeft, FaAlignCenter, FaAlignRight, FaLayerGroup, FaEye, FaEyeSlash, FaTable } from "react-icons/fa";
import { FaShapes, FaTableCells } from "react-icons/fa6";
import { TbLine } from "react-icons/tb";
import LineComponent from "./LineComponent";
import { useState } from "react";

export default function Tools({ 
  elements, 
  setElements, 
  selectedId, 
  setSelectedId, 
  clipboard, 
  setClipboard,
  successAlert,
  addElement 
}) {
  const [showLineComponent, setShowLineComponent] = useState(false);
  
  const copyElement = () => {
    if (!selectedId) return;
    const element = elements.find(el => el.id === selectedId);
    if (element) {
      setClipboard(element);
      successAlert("Element copied!");
    }
  };

  const pasteElement = () => {
    if (!clipboard) return;
    const newElement = { 
      ...clipboard, 
      id: Date.now(), 
      x: clipboard.x + 20, 
      y: clipboard.y + 20 
    };
    setElements(prev => [...prev, newElement]);
    setSelectedId(newElement.id);
    successAlert("Element pasted!");
  };

  const alignElements = (alignment) => {
    if (!selectedId) return;
    const element = elements.find(el => el.id === selectedId);
    if (!element) return;

    let newX = element.x;
    const canvasWidth = 337; // Default canvas width

    switch (alignment) {
      case 'left':
        newX = 10;
        break;
      case 'center':
        newX = (canvasWidth - element.width) / 2;
        break;
      case 'right':
        newX = canvasWidth - element.width - 10;
        break;
    }

    setElements(prev => 
      prev.map(el => 
        el.id === selectedId ? { ...el, x: newX } : el
      )
    );
  };

  const bringToFront = () => {
    if (!selectedId) return;
    setElements(prev => {
      const element = prev.find(el => el.id === selectedId);
      const others = prev.filter(el => el.id !== selectedId);
      return [...others, element];
    });
  };

  const sendToBack = () => {
    if (!selectedId) return;
    setElements(prev => {
      const element = prev.find(el => el.id === selectedId);
      const others = prev.filter(el => el.id !== selectedId);
      return [element, ...others];
    });
  };

  const toggleVisibility = () => {
    if (!selectedId) return;
    setElements(prev => 
      prev.map(el => 
        el.id === selectedId 
          ? { ...el, opacity: el.opacity === 0 ? 1 : 0 }
          : el
      )
    );
  };

  const duplicateElement = () => {
    if (!selectedId) return;
    const element = elements.find(el => el.id === selectedId);
    if (element) {
      const newElement = { 
        ...element, 
        id: Date.now(), 
        x: element.x + 20, 
        y: element.y + 20 
      };
      setElements(prev => [...prev, newElement]);
      setSelectedId(newElement.id);
      successAlert("Element duplicated!");
    }
  };

  const addTable = () => {
    const id = Date.now();
    const newTable = {
      id,
      type: 'table',
      x: 50,
      y: 50,
      width: 200,
      height: 150,
      rows: 3,
      cols: 3,
      borderWidth: 1,
      borderColor: '#000',
      cellPadding: 5,
      fontSize: 12,
      fontFamily: 'Arial',
      textColor: '#000',
      backgroundColor: 'transparent',
      cellData: {}
    };
    setElements(prev => [...prev, newTable]);
    setSelectedId(id);
    successAlert('Table added!');
  };

  const selectedElement = elements.find(el => el.id === selectedId);

  return (
    <div className="pt-9 bg-transparent  ">

      <div>
        <div 
        onClick={addTable}
        className=" border dark:border-blue-700 cursor-pointer dark:hover:bg-blue-700 hover:bg-gray-300 px-4 py-3"
      >
        <FaTable />
      </div>
      <div 
        className="border dark:border-blue-700 cursor-pointer dark:hover:bg-blue-700 hover:bg-gray-300 relative px-4 py-3"
        onClick={() => setShowLineComponent(!showLineComponent)}
      >
        <TbLine />
        {showLineComponent && (
          <div 
            className="fixed left-[98px] top-[220px] bg-white dark:bg-[#131837] border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-[9999]"
          >
            <LineComponent 
              elements={elements}
              setElements={setElements}
              setSelectedId={setSelectedId}
              successAlert={successAlert}
            />
          </div>
        )}
      </div>
      </div>
    </div>
  );
}