import { FaSave } from "react-icons/fa";
import { GrDocumentUpdate } from "react-icons/gr";
import { FaImage, FaFilePdf, FaFileCode, FaDatabase, FaDownload } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

export default function SaveButton({ 
  cardDesign, 
  school, 
  background, 
  elements, 
  zoom, 
  setCardDesign, 
  successAlert, 
  errorAlert,
  cardRef,
  canvasSize 
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('local');
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const saveToDatabase = (format) => {
    const designUUID = cardDesign?.uuid || school?.uuid;
    const mode = cardDesign?.uuid ? "edit" : "create";

    const exportElements = elements.map((el) => {
      if (el.type === "image" && el.variableName) {
        return { ...el, src: `{{${el.variableName}}}` };
      }
      return el;
    });

    const designJSON = { background, elements: exportElements, zoom, mode };

    fetch(`/superadmin/schools/card-designs/save-card-json/${designUUID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document
          .querySelector('meta[name="csrf-token"]')
          .getAttribute("content"),
      },
      body: JSON.stringify(designJSON),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          successAlert(`Design saved to database as ${format}!`);
          setCardDesign(data.card);
        } else {
          errorAlert("Error saving design!");
        }
      })
      .catch(() => errorAlert("Error saving design!"));
  };

  const drawShapeElement = (ctx, el) => {
    ctx.fillStyle = el.fill || '#FF0000';
    ctx.strokeStyle = el.stroke || '#000';
    ctx.lineWidth = el.strokeWidth || 1;
    
    switch(el.type) {
      case 'square':
        ctx.fillRect(0, 0, el.width, el.height);
        ctx.strokeRect(0, 0, el.width, el.height);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(el.width/2, el.height/2, Math.min(el.width, el.height)/2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(el.width/2, 0);
        ctx.lineTo(el.width, el.height);
        ctx.lineTo(0, el.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 'star':
        ctx.beginPath();
        const spikes = 5;
        const outerRadius = el.width / 2;
        const innerRadius = outerRadius * 0.4;
        const centerX = el.width / 2;
        const centerY = el.height / 2;
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / spikes - Math.PI / 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(el.width/2, 0);
        ctx.lineTo(el.width, el.height/2);
        ctx.lineTo(el.width/2, el.height);
        ctx.lineTo(0, el.height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 'pentagon':
        ctx.beginPath();
        const sides = 5;
        const centerXp = el.width / 2;
        const centerYp = el.height / 2;
        const radiusp = Math.min(el.width, el.height) / 2;
        for (let i = 0; i < sides; i++) {
          const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
          const x = centerXp + Math.cos(angle) * radiusp;
          const y = centerYp + Math.sin(angle) * radiusp;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 'hexagon':
        ctx.beginPath();
        const sidesH = 6;
        const centerXh = el.width / 2;
        const centerYh = el.height / 2;
        const radiush = Math.min(el.width, el.height) / 2;
        for (let i = 0; i < sidesH; i++) {
          const angle = (i * 2 * Math.PI) / sidesH;
          const x = centerXh + Math.cos(angle) * radiush;
          const y = centerYh + Math.sin(angle) * radiush;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 'octagon':
        ctx.beginPath();
        const sidesO = 8;
        const centerXo = el.width / 2;
        const centerYo = el.height / 2;
        const radiuso = Math.min(el.width, el.height) / 2;
        for (let i = 0; i < sidesO; i++) {
          const angle = (i * 2 * Math.PI) / sidesO;
          const x = centerXo + Math.cos(angle) * radiuso;
          const y = centerYo + Math.sin(angle) * radiuso;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

    }
  };

  const drawTextElement = (ctx, el) => {
    ctx.fillStyle = el.color || '#000';
    
    // Build font string properly
    let fontStyle = '';
    if (el.italic) fontStyle += 'italic ';
    if (el.bold) fontStyle += 'bold ';
    ctx.font = `${fontStyle}${el.fontSize || 16}px ${el.fontFamily || 'Arial'}`;
    
    ctx.textAlign = el.textAlign || 'left';
    ctx.textBaseline = 'top';
    
    // Calculate x position based on text alignment and element width
    const getXPosition = (align) => {
      switch(align) {
        case 'center': return el.width / 2;
        case 'right': return el.width;
        case 'justify': return 0; // justify uses left alignment with word spacing
        default: return 0; // left
      }
    };
    
    const xPos = getXPosition(el.textAlign);
    
    // Apply text transform
    const applyTransform = (text) => {
      if (!text) return '';
      const t = el.textTransform;
      if (t === 'uppercase') return text.toUpperCase();
      if (t === 'lowercase') return text.toLowerCase();
      if (t === 'capitalize') return text.replace(/\b\w/g, l => l.toUpperCase());
      if (t === 'sentence') {
        return text.toLowerCase().replace(/(^\s*[a-z])|([.!?]\s*[a-z])/g, (m) => m.toUpperCase());
      }
      if (t === 'toggle') {
        return [...text].map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join('');
      }
      return text;
    };
    
    if (el.type === 'orderedList' || el.type === 'unorderedList') {
      const items = el.listItems || [];
      let currentY = 0;
      
      items.forEach((item, index) => {
        const prefix = el.type === 'orderedList' ? `${index + 1}. ` : '• ';
        const transformedItem = applyTransform(item);
        const fullText = prefix + transformedItem;
        
        // Wrap list item text based on element width
        const wrappedLines = [];
        if (ctx.measureText(fullText).width <= el.width) {
          wrappedLines.push(fullText);
        } else {
          const prefixWidth = ctx.measureText(prefix).width;
          const availableWidth = el.width - prefixWidth;
          const words = transformedItem.split(' ');
          let currentLine = '';
          
          words.forEach(word => {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            if (ctx.measureText(testLine).width <= availableWidth) {
              currentLine = testLine;
            } else {
              if (currentLine) {
                wrappedLines.push(prefix + currentLine);
                currentLine = word;
              } else {
                wrappedLines.push(prefix + word);
              }
            }
          });
          
          if (currentLine) {
            wrappedLines.push(prefix + currentLine);
          }
        }
        
        wrappedLines.forEach((line, lineIndex) => {
          const y = currentY + (lineIndex * (el.fontSize + 5));
          
          // Draw with underline if needed
          if (el.underline) {
            ctx.fillText(line, xPos, y);
            const textWidth = ctx.measureText(line).width;
            const underlineX = el.textAlign === 'center' ? xPos - textWidth/2 : 
                             el.textAlign === 'right' ? xPos - textWidth : xPos;
            ctx.beginPath();
            ctx.moveTo(underlineX, y + el.fontSize);
            ctx.lineTo(underlineX + textWidth, y + el.fontSize);
            ctx.strokeStyle = el.color || '#000';
            ctx.lineWidth = 1;
            ctx.stroke();
          } else {
            ctx.fillText(line, xPos, y);
          }
        });
        
        currentY += wrappedLines.length * (el.fontSize + 5);
      });
    } else {
      let displayText = el.text || '';
      
      // Apply abbreviation if set
      if (el.abbrevStrategy && displayText) {
        const parts = displayText.split(' ').filter(Boolean);
        switch (el.abbrevStrategy) {
          case 'initials-last':
            displayText = parts.map((p, i) => (i < parts.length - 1 ? p[0] + '.' : p)).join(' ');
            break;
          case 'initials-all':
            displayText = parts.map((p) => p[0].toUpperCase() + '.').join('');
            break;
          case 'first-last':
            displayText = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : displayText;
            break;
          case 'first-middle-initials':
            if (parts.length >= 2) {
              displayText = parts[0] + ' ' + parts.slice(1).map((p) => p[0].toUpperCase() + '.').join('');
            }
            break;
          case 'first-two':
            displayText = parts.slice(0, 2).join(' ');
            break;
        }
      }
      
      displayText = applyTransform(displayText);
      const lines = displayText.split('\n');
      
      // Wrap text based on element width
      const wrappedLines = [];
      lines.forEach(line => {
        if (ctx.measureText(line).width <= el.width) {
          wrappedLines.push(line);
        } else {
          const words = line.split(' ');
          let currentLine = '';
          
          words.forEach(word => {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            if (ctx.measureText(testLine).width <= el.width) {
              currentLine = testLine;
            } else {
              if (currentLine) {
                wrappedLines.push(currentLine);
                currentLine = word;
              } else {
                wrappedLines.push(word);
              }
            }
          });
          
          if (currentLine) {
            wrappedLines.push(currentLine);
          }
        }
      });
      
      wrappedLines.forEach((line, index) => {
        const y = index * (el.fontSize + 5);
        
        // Draw with underline if needed
        if (el.underline) {
          ctx.fillText(line, xPos, y);
          const textWidth = ctx.measureText(line).width;
          const underlineX = el.textAlign === 'center' ? xPos - textWidth/2 : 
                           el.textAlign === 'right' ? xPos - textWidth : xPos;
          ctx.beginPath();
          ctx.moveTo(underlineX, y + el.fontSize);
          ctx.lineTo(underlineX + textWidth, y + el.fontSize);
          ctx.strokeStyle = el.color || '#000';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillText(line, xPos, y);
        }
      });
    }
  };

  const drawTableElement = (ctx, el) => {
    const { rows = 3, cols = 3, borderWidth = 1, borderColor = "#000", cellPadding = 5, fontSize = 12, fontFamily = "Arial", textColor = "#000", backgroundColor = "transparent" } = el;
    const cellWidth = el.width / cols;
    const cellHeight = el.height / rows;
    
    // Background
    if (backgroundColor !== "transparent") {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, el.width, el.height);
    }
    
    // Draw grid
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    
    // Vertical lines
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellWidth, 0);
      ctx.lineTo(i * cellWidth, el.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellHeight);
      ctx.lineTo(el.width, i * cellHeight);
      ctx.stroke();
    }
    
    // Draw cell text
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cellKey = `cell_${row}_${col}`;
        const cellText = el.cellData?.[cellKey] || '';
        if (cellText) {
          ctx.fillText(cellText, col * cellWidth + cellPadding, row * cellHeight + cellPadding);
        }
      }
    }
  };

  const drawLineElement = (ctx, el) => {
    ctx.strokeStyle = el.stroke || "#000";
    ctx.lineWidth = el.strokeWidth || 2;
    
    switch(el.lineType) {
      case 'horizontal':
        ctx.beginPath();
        ctx.moveTo(0, el.height/2);
        ctx.lineTo(el.width, el.height/2);
        ctx.stroke();
        break;
      case 'vertical':
        ctx.beginPath();
        ctx.moveTo(el.width/2, 0);
        ctx.lineTo(el.width/2, el.height);
        ctx.stroke();
        break;
      case 'diagonal':
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(el.width, el.height);
        ctx.stroke();
        break;
      case 'curve':
        ctx.beginPath();
        ctx.moveTo(0, el.height);
        ctx.quadraticCurveTo(el.width/2, 0, el.width, el.height);
        ctx.stroke();
        break;
      case 'zigzag':
        ctx.beginPath();
        ctx.moveTo(0, el.height/2);
        ctx.lineTo(el.width/4, 0);
        ctx.lineTo(el.width/2, el.height);
        ctx.lineTo(3*el.width/4, 0);
        ctx.lineTo(el.width, el.height/2);
        ctx.stroke();
        break;
    }
  };

  const drawElementsOnCanvas = async (ctx) => {
    // Sort elements by zIndex for proper layering
    const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    
    for (const el of sortedElements) {
      ctx.save();
      
      if (el.type === 'image' && el.src) {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            ctx.translate(el.x + el.width/2, el.y + el.height/2);
            ctx.rotate((el.rotation || 0) * Math.PI / 180);
            ctx.globalAlpha = el.opacity || 1;
            ctx.drawImage(img, -el.width/2, -el.height/2, el.width, el.height);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = el.src;
        });
      } else {
        ctx.translate(el.x + el.width/2, el.y + el.height/2);
        ctx.rotate((el.rotation || 0) * Math.PI / 180);
        ctx.globalAlpha = el.opacity || 1;
        ctx.translate(-el.width/2, -el.height/2);
        
        if (el.type === 'text' || el.type === 'orderedList' || el.type === 'unorderedList') {
          drawTextElement(ctx, el);
        } else if (['square', 'circle', 'triangle', 'star', 'diamond', 'pentagon', 'hexagon', 'octagon'].includes(el.type)) {
          drawShapeElement(ctx, el);
        } else if (el.type === 'table') {
          drawTableElement(ctx, el);
        } else if (el.type === 'line') {
          drawLineElement(ctx, el);
        }
      }
      
      ctx.restore();
    }
  };

  const downloadCanvas = (canvas, filename) => {
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    successAlert('Image downloaded successfully!');
  };

  const generateCanvasPDF = async (designName) => {
  const scale = 3; // High quality
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = canvasSize.width * scale;
  canvas.height = canvasSize.height * scale;
  ctx.scale(scale, scale);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (background) {
    await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = background;
    });
  }

  await drawElementsOnCanvas(ctx);

  const imgData = canvas.toDataURL('image/png');
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>${designName}</title>
        <style>
          body { margin: 0; padding: 0; }
          img { width: 100%; height: auto; display: block; }
        </style>
      </head>
      <body>
        <img src="${imgData}" alt="Design" />
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 1000);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
  successAlert('PDF print dialog opened!');
};


  const saveToLocal = (format) => {
  const designName = school?.name || 'card-design';

  if (format === 'Image') {
    const scale = 5; // 👈 3x better quality (adjust as needed)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = canvasSize.width * scale;
    canvas.height = canvasSize.height * scale;

    // upscale drawing
    ctx.scale(scale, scale);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (background) {
      const img = new Image();
      img.onload = async () => {
        ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
        await drawElementsOnCanvas(ctx);
        downloadCanvas(canvas, `${designName}.png`);
      };
      img.src = background;
    } else {
      drawElementsOnCanvas(ctx).then(() => {
        downloadCanvas(canvas, `${designName}.png`);
      });
    }
  } else if (format === 'PDF') {
    generateCanvasPDF(designName);
  } else if (format === 'JSON') {
    // JSON export as is
    const exportElements = elements.map((el) => {
      if (el.type === "image" && el.variableName) {
        return { ...el, src: `{{${el.variableName}}}` };
      }
      return el;
    });
    const designJSON = { background, elements: exportElements, zoom };
    const blob = new Blob([JSON.stringify(designJSON, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${designName}.json`;
    a.click();
    URL.revokeObjectURL(url);
    successAlert('JSON downloaded successfully!');
  }

  setShowPopup(false);
};


  const handleSave = (format) => {
    if (activeTab === 'local') {
      saveToLocal(format);
    } else {
      saveToDatabase(format);
      setShowPopup(false);
    }
  };

  return (
    <div className="relative flex items-center" ref={popupRef}>
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="relative group px-2 py-2 rounded-lg font-semibold text-sm text-white
        bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 
        shadow-lg hover:shadow-emerald-500/50 
        transform hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300"></span>
        <span className="relative flex items-center gap-2">
          {cardDesign ? (
            <>
              <GrDocumentUpdate size={18} /> Update Design
            </>
          ) : (
            <>
              <FaSave size={18} /> Save Design
            </>
          )}
        </span>
      </button>

      {showPopup && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-[#0a0e37] border border-gray-200 dark:border-blue-700 rounded-lg shadow-2xl z-50 w-80 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Save Design</h3>
            <button
              onClick={() => setShowPopup(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              X
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mb-4 bg-gray-100 dark:bg-[#131827] rounded-lg p-1">
            <button
              onClick={() => setActiveTab('local')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'local'
                  ? 'bg-white dark:bg-blue-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FaDownload className="inline mr-2" size={12} />
              Local
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'database'
                  ? 'bg-white dark:bg-blue-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FaDatabase className="inline mr-2" size={12} />
              Database
            </button>
          </div>

          {/* Format Buttons */}
          <div className="space-y-2">
            {activeTab === 'local' ? (
              <>
                <button
                  onClick={() => handleSave('Image')}
                  className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-[#131827] hover:bg-gray-100 dark:hover:bg-blue-600 rounded-lg transition-colors border dark:border-blue-800"
                >
                  <FaImage className="text-blue-500" size={20} />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Save as Image</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">PNG format</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSave('PDF')}
                  className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-[#131827] hover:bg-gray-100 dark:hover:bg-blue-600 rounded-lg transition-colors border dark:border-blue-800"
                >
                  <FaFilePdf className="text-red-500" size={20} />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Save as PDF</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Printable format</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleSave('JSON')}
                  className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-[#131827] hover:bg-gray-100 dark:hover:bg-blue-600 rounded-lg transition-colors border dark:border-blue-800"
                >
                  <FaFileCode className="text-green-500" size={20} />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Save as JSON</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Design data</div>
                  </div>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleSave('JSON')}
                className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-[#131827] hover:bg-gray-100 dark:hover:bg-blue-600 rounded-lg transition-colors border dark:border-blue-800"
              >
                <FaSave className="text-green-500" size={20} />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Save Design</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Save to database</div>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}