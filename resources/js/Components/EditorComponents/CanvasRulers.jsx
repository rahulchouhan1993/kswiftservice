import { useEffect } from "react";

export default function CanvasRulers({
  cardRef,
  canvasSize,
  zoom,
  setZoom,
  background,
  backgroundFit,
  elements,
  selectedId,
  selectedElementId,
  setSelectedElementId,
  setSelectedId,
  setDragging,
  updateElement,
  setResizing,
  guides,
  cssTransformFor,
  renderTransform,
  abbreviateName
}) {
  useEffect(() => {
    const drawRuler = (ctx, length, horizontal = true) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = "#666";
      ctx.font = "10px Arial";
      ctx.beginPath();
      for (let i = 0; i <= length; i += 10) {
        const major = i % 50 === 0;
        if (horizontal) {
          ctx.moveTo(i + 0.5, 30);
          ctx.lineTo(i + 0.5, 30 - (major ? 10 : 5));
          if (major) ctx.fillText(i, i + 2, 10);
        } else {
          ctx.moveTo(30, i + 0.5);
          ctx.lineTo(30 - (major ? 10 : 5), i + 0.5);
          if (major) ctx.fillText(i, 2, i + 10);
        }
      }
      ctx.strokeStyle = "#666";
      ctx.stroke();
    };

    const topCtx = document.getElementById("ruler-top")?.getContext("2d");
    if (topCtx) drawRuler(topCtx, canvasSize.width, true);

    const leftCtx = document.getElementById("ruler-left")?.getContext("2d");
    if (leftCtx) drawRuler(leftCtx, canvasSize.height, false);
  }, [canvasSize, zoom]);

  return (
    <div className="flex-1 flex justify-evenly items-start px-4  overflow-auto bg-gray-50 dark:bg-[#0a0e37] relative">

      <div 
        className="flex"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
        }}
      >
        {/* Left ruler */}
        <canvas
          id="ruler-left"
          width={30}
          height={canvasSize.height}
          style={{ 
            marginTop: "30px"
          }}
        />

        <div>
          {/* Top ruler */}
          <canvas
            id="ruler-top"
            width={canvasSize.width}
            height={30}
          />

          {/* Main canvas */}
          <div>
            <div
              ref={cardRef}
              className="relative shadow bg-white overflow-hidden"
              style={{
                width: `${canvasSize.width}px`,
                height: `${canvasSize.height}px`,
                backgroundImage: background ? `url(${background})` : "none",
                backgroundSize: backgroundFit,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Elements rendering */}
              {elements.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)).map((el) => {
                if (el.type === "text" || el.type === "orderedList" || el.type === "unorderedList") {
                  const cssTextTransform = cssTransformFor(el.textTransform);
                  let display = renderTransform(el.text, el.textTransform);
                  if (el.abbrevStrategy && el.text) {
                    display = abbreviateName(el.text, el.abbrevStrategy);
                  }

                  // Handle list rendering
                  if (el.type === "orderedList" || el.type === "unorderedList") {
                    const items = el.listItems || [];
                    return (
                      <div
                        key={el.id}
                        style={{
                          position: "absolute",
                          top: el.y,
                          left: el.x,
                          width: el.width,
                          cursor: "move",
                          color: el.color,
                          fontSize: `${el.fontSize}px`,
                          fontFamily: el.fontFamily,
                          fontWeight: el.bold ? "bold" : "normal",
                          fontStyle: el.italic ? "italic" : "normal",
                          textDecoration: el.underline ? "underline" : "none",
                          textAlign: el.textAlign || "left",
                          textTransform: cssTextTransform,
                          zIndex: el.zIndex || 0,
                        }}
                        className={`group ${selectedId === el.id ? "outline outline-2 outline-blue-500" : ""}`}
                        onMouseDown={(e) => {
                          setSelectedElementId(el.id);
                          setSelectedId(el.id);
                          setDragging({
                            id: el.id,
                            offsetX: e.clientX - el.x,
                            offsetY: e.clientY - el.y,
                          });
                        }}
                      >
                        {el.type === "orderedList" ? (
                          <ol style={{ 
                            margin: 0, 
                            paddingLeft: "20px",
                            listStyleType: "decimal",
                            listStylePosition: "outside"
                          }}>
                            {items.map((item, index) => (
                              <li key={index} style={{ 
                                marginBottom: "2px",
                                display: "list-item"
                              }}>{item}</li>
                            ))}
                          </ol>
                        ) : (
                          <ul style={{ 
                            margin: 0, 
                            paddingLeft: "20px",
                            listStyleType: "disc",
                            listStylePosition: "outside"
                          }}>
                            {items.map((item, index) => (
                              <li key={index} style={{ 
                                marginBottom: "2px",
                                display: "list-item"
                              }}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={el.id}
                      style={{
                        position: "absolute",
                        top: el.y,
                        left: el.x,
                        width: el.width,
                        cursor: el.editing ? "text" : "move",
                        color: el.color,
                        fontSize: `${el.fontSize}px`,
                        fontFamily: el.fontFamily,
                        fontWeight: el.bold ? "bold" : "normal",
                        fontStyle: el.italic ? "italic" : "normal",
                        textDecoration: el.underline ? "underline" : "none",
                        textAlign: el.textAlign || "left",
                        textTransform: cssTextTransform,
                        whiteSpace: "pre-wrap",
                        border: selectedElementId === el.id ? "1px dashed gray" : "none",
                        zIndex: el.zIndex || 0,
                      }}
                      className={`group ${selectedId === el.id ? "outline outline-2 outline-blue-500" : ""}`}
                      onMouseDown={(e) => {
                        if (!el.editing) {
                          setSelectedElementId(el.id);
                          setSelectedId(el.id);
                          setDragging({
                            id: el.id,
                            offsetX: e.clientX - el.x,
                            offsetY: e.clientY - el.y,
                          });
                        }
                      }}
                      onDoubleClick={() => updateElement(el.id, "editing", true)}
                    >
                      {el.editing ? (
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          autoFocus
                          onBlur={(e) => {
                            updateElement(el.id, "text", e.target.innerText);
                            updateElement(el.id, "editing", false);
                          }}
                          style={{
                            width: "100%",
                            outline: "none",
                            cursor: "text",
                          }}
                        >
                          {el.text}
                        </div>
                      ) : (
                        display
                      )}
                    </div>
                  );
                }

                if (el.type === "image") {
                  const allowedVariables = [
                    "student_photo",
                    "student_signature",
                    "father_photo",
                    "father_signature",
                    "mother_photo",
                    "mother_signature",
                    "school_logo",
                    "school_signature",
                  ];
                  return (
                    <div
                      key={el.id}
                      style={{
                        position: "absolute",
                        top: el.y,
                        left: el.x,
                        width: el.width,
                        height: el.height,
                        border: `${el.borderWidth || 0}px solid ${el.borderColor || "transparent"}`,
                        borderRadius: `${el.borderRadius || 0}px`,
                        opacity: el.opacity !== undefined ? el.opacity : 1,
                        transform: `
                          scaleX(${el.flipX ? -1 : 1})
                          scaleY(${el.flipY ? -1 : 1})
                          rotate(${el.rotation || 0}deg)
                        `,
                        transformOrigin: "center",
                        cursor: "move",
                        overflow: "hidden",
                        zIndex: el.zIndex || 0,
                      }}
                      className={`group ${selectedId === el.id ? "outline outline-2 outline-blue-500" : ""}`}
                      onMouseDown={(e) => {
                        setSelectedId(el.id);
                        setDragging({
                          id: el.id,
                          offsetX: e.clientX - el.x,
                          offsetY: e.clientY - el.y,
                        });
                      }}
                      onDoubleClick={() => {
                        let variableName = null;
                        while (true) {
                          variableName = prompt(
                            "Accepted Variables:\n" + allowedVariables.join(", "),
                            variableName || ""
                          );
                          if (!variableName) break;
                          variableName = variableName.trim();
                          if (allowedVariables.includes(variableName)) {
                            updateElement(el.id, "variableName", variableName);
                            break;
                          } else {
                            alert("❌ Invalid variable. Please use only: " + allowedVariables.join(", "));
                          }
                        }
                      }}
                    >
                      <img
                        src={el.src}
                        alt=""
                        draggable={false}
                        className="w-full h-full pointer-events-none"
                        style={{ borderRadius: `${el.borderRadius || 0}px` }}
                      />
                      {selectedId === el.id && (
                        <div
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setResizing({
                              id: el.id,
                              startX: e.clientX,
                              startY: e.clientY,
                              startW: el.width,
                              startH: el.height,
                            });
                          }}
                          className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 cursor-se-resize"
                        />
                      )}
                    </div>
                  );
                }

                if (el.type === "table") {
                  const { rows = 3, cols = 3, borderWidth = 1, borderColor = "#000", cellPadding = 5, fontSize = 12, fontFamily = "Arial", textColor = "#000", backgroundColor = "transparent" } = el;
                  const cellWidth = el.width / cols;
                  const cellHeight = el.height / rows;

                  return (
                    <div
                      key={el.id}
                      style={{
                        position: "absolute",
                        left: el.x,
                        top: el.y,
                        width: el.width,
                        height: el.height,
                        cursor: "move",
                        zIndex: el.zIndex || 0,
                      }}
                      className={`${selectedId === el.id ? "outline outline-2 outline-blue-500" : ""}`}
                      onMouseDown={(e) => {
                        setSelectedId(el.id);
                        setDragging({
                          id: el.id,
                          offsetX: e.clientX - el.x,
                          offsetY: e.clientY - el.y,
                        });
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                          height: "100%",
                          borderCollapse: "collapse",
                          backgroundColor,
                          fontFamily,
                          fontSize: `${fontSize}px`,
                          color: textColor
                        }}
                      >
                        <tbody>
                          {Array.from({ length: rows }, (_, rowIndex) => (
                            <tr key={rowIndex}>
                              {Array.from({ length: cols }, (_, colIndex) => {
                                const cellKey = `cell_${rowIndex}_${colIndex}`;
                                const cellText = el.cellData?.[cellKey] || '';
                                
                                return (
                                  <td
                                    key={colIndex}
                                    style={{
                                      border: `${borderWidth}px solid ${borderColor}`,
                                      padding: `${cellPadding}px`,
                                      width: `${cellWidth}px`,
                                      height: `${cellHeight}px`,
                                      textAlign: "left",
                                      verticalAlign: "top",
                                      cursor: "text",
                                      overflow: "hidden",
                                      wordWrap: "break-word"
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (selectedId === el.id) {
                                        const newText = prompt('Enter cell text:', cellText);
                                        if (newText !== null) {
                                          const newCellData = { ...el.cellData, [cellKey]: newText };
                                          updateElement(el.id, 'cellData', newCellData);
                                        }
                                      }
                                    }}
                                  >
                                    {cellText}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {selectedId === el.id && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: -5,
                            right: -5,
                            width: 10,
                            height: 10,
                            backgroundColor: "#3b82f6",
                            cursor: "se-resize",
                            borderRadius: "2px"
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setResizing({
                              id: el.id,
                              startX: e.clientX,
                              startY: e.clientY,
                              startW: el.width,
                              startH: el.height,
                            });
                          }}
                        />
                      )}
                    </div>
                  );
                }

                if (el.type === "line") {
                  const getLineStyle = () => {
                    const baseStyle = {
                      position: "absolute",
                      top: el.y,
                      left: el.x,
                      width: el.width,
                      height: el.height,
                      transform: `rotate(${el.rotation || 0}deg)`,
                      opacity: el.opacity ?? 1,
                      cursor: "move",
                      transformOrigin: "center"
                    };

                    switch (el.lineType) {
                      case 'horizontal':
                        return {
                          ...baseStyle,
                          borderTop: `${el.strokeWidth}px solid ${el.stroke}`,
                          height: el.strokeWidth
                        };
                      case 'vertical':
                        return {
                          ...baseStyle,
                          borderLeft: `${el.strokeWidth}px solid ${el.stroke}`,
                          width: el.strokeWidth
                        };
                      case 'diagonal':
                        return {
                          ...baseStyle,
                          background: `linear-gradient(45deg, transparent 45%, ${el.stroke} 45%, ${el.stroke} 55%, transparent 55%)`
                        };
                      default:
                        return {
                          ...baseStyle,
                          borderTop: `${el.strokeWidth}px solid ${el.stroke}`,
                          height: el.strokeWidth
                        };
                    }
                  };

                  // For curve, zigzag, and diagonal, use SVG for better rendering
                  if (el.lineType === 'curve' || el.lineType === 'zigzag' || el.lineType === 'diagonal') {
                    return (
                      <svg
                        key={el.id}
                        width={el.width}
                        height={el.height}
                        style={{
                          position: "absolute",
                          top: el.y,
                          left: el.x,
                          transform: `rotate(${el.rotation || 0}deg)`,
                          opacity: el.opacity ?? 1,
                          cursor: "move",
                          zIndex: el.zIndex || 0,
                        }}
                        className={`${selectedId === el.id ? "outline outline-2 outline-blue-500" : ""}`}
                        onMouseDown={(e) => {
                          setSelectedId(el.id);
                          setDragging({
                            id: el.id,
                            offsetX: e.clientX - el.x,
                            offsetY: e.clientY - el.y,
                          });
                        }}
                      >
                        {el.lineType === 'curve' && (
                          <path 
                            d={`M 0 ${el.height} Q ${el.width/2} 0 ${el.width} ${el.height}`} 
                            stroke={el.stroke} 
                            strokeWidth={el.strokeWidth} 
                            fill="none" 
                          />
                        )}
                        {el.lineType === 'zigzag' && (
                          <polyline 
                            points={`0,${el.height/2} ${el.width/4},0 ${el.width/2},${el.height} ${3*el.width/4},0 ${el.width},${el.height/2}`} 
                            stroke={el.stroke} 
                            strokeWidth={el.strokeWidth} 
                            fill="none" 
                          />
                        )}
                        {el.lineType === 'diagonal' && (
                          <line 
                            x1="0" 
                            y1="0" 
                            x2={el.width} 
                            y2={el.height} 
                            stroke={el.stroke} 
                            strokeWidth={el.strokeWidth} 
                          />
                        )}
                        {selectedId === el.id && (
                          <rect
                            x={el.width - 8}
                            y={el.height - 8}
                            width={8}
                            height={8}
                            fill="blue"
                            className="cursor-se-resize"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setResizing({
                                id: el.id,
                                startX: e.clientX,
                                startY: e.clientY,
                                startW: el.width,
                                startH: el.height,
                              });
                            }}
                          />
                        )}
                      </svg>
                    );
                  }

                  // CSS-based lines for better html2canvas compatibility
                  return (
                    <div
                      key={el.id}
                      style={getLineStyle()}
                      className={`${selectedId === el.id ? "outline outline-2 outline-blue-500" : ""}`}
                      onMouseDown={(e) => {
                        setSelectedId(el.id);
                        setDragging({
                          id: el.id,
                          offsetX: e.clientX - el.x,
                          offsetY: e.clientY - el.y,
                        });
                      }}
                    >
                      {selectedId === el.id && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: -5,
                            right: -5,
                            width: 10,
                            height: 10,
                            backgroundColor: "blue",
                            cursor: "se-resize",
                            borderRadius: "2px"
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setResizing({
                              id: el.id,
                              startX: e.clientX,
                              startY: e.clientY,
                              startW: el.width,
                              startH: el.height,
                            });
                          }}
                        />
                      )}
                    </div>
                  );
                }

                if (["square", "star", "circle", "triangle", "diamond", "pentagon", "hexagon", "octagon"].includes(el.type)) {
                  return (
                    <svg
                      key={el.id}
                      xmlns="http://www.w3.org/2000/svg"
                      width={el.width}
                      height={el.height}
                      style={{
                        position: "absolute",
                        top: el.y,
                        left: el.x,
                        transform: `rotate(${el.rotation || 0}deg)`,
                        opacity: el.opacity ?? 1,
                        cursor: "move",
                        zIndex: el.zIndex || 0,
                      }}
                      onMouseDown={(e) => {
                        setSelectedId(el.id);
                        setDragging({
                          id: el.id,
                          offsetX: e.clientX - el.x,
                          offsetY: e.clientY - el.y,
                        });
                      }}
                    >
                      {el.type === "square" && (
                        <rect width="100%" height="100%" fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} />
                      )}
                      {el.type === "star" && (
                        <polygon
                          points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
                          fill={el.fill}
                          stroke={el.stroke}
                          strokeWidth={el.strokeWidth}
                          transform={`scale(${el.width / 100}, ${el.height / 100})`}
                        />
                      )}
                      {el.type === "circle" && (
                        <circle
                          cx={el.width/2}
                          cy={el.height/2}
                          r={Math.min(el.width, el.height)/2}
                          fill={el.fill}
                          stroke={el.stroke}
                          strokeWidth={el.strokeWidth}
                        />
                      )}
                      {el.type === "triangle" && (
                        <polygon
                          points={`${el.width/2},0 ${el.width},${el.height} 0,${el.height}`}
                          fill={el.fill}
                          stroke={el.stroke}
                          strokeWidth={el.strokeWidth}
                        />
                      )}
                      {el.type === "diamond" && (
                        <polygon
                          points={`${el.width/2},0 ${el.width},${el.height/2} ${el.width/2},${el.height} 0,${el.height/2}`}
                          fill={el.fill}
                          stroke={el.stroke}
                          strokeWidth={el.strokeWidth}
                        />
                      )}
                      {el.type === "pentagon" && (
                        <polygon
                          points={`${el.width/2},0 ${el.width*0.95},${el.height*0.35} ${el.width*0.8},${el.height} ${el.width*0.2},${el.height} ${el.width*0.05},${el.height*0.35}`}
                          fill={el.fill}
                          stroke={el.stroke}
                          strokeWidth={el.strokeWidth}
                        />
                      )}
                      {el.type === "hexagon" && (
                        <polygon
                          points={`${el.width*0.25},0 ${el.width*0.75},0 ${el.width},${el.height/2} ${el.width*0.75},${el.height} ${el.width*0.25},${el.height} 0,${el.height/2}`}
                          fill={el.fill}
                          stroke={el.stroke}
                          strokeWidth={el.strokeWidth}
                        />
                      )}
                      {el.type === "trapezium" && (
                        <polygon
                          points={`${el.width*0.25},0 ${el.width*0.75},0 ${el.width*0.9},${el.height} ${el.width*0.1},${el.height}`}
                          fill={el.fill}
                          stroke={el.stroke}
                          strokeWidth={el.strokeWidth}
                        />
                      )}
                      {el.type === "octagon" && (
                        <polygon
                          points={`${el.width*0.3},0 ${el.width*0.7},0 ${el.width},${el.height*0.3} ${el.width},${el.height*0.7} ${el.width*0.7},${el.height} ${el.width*0.3},${el.height} 0,${el.height*0.7} 0,${el.height*0.3}`}
                          fill={el.fill}
                          stroke={el.stroke}
                          strokeWidth={el.strokeWidth}
                        />
                      )}

                      {selectedId === el.id && (
                        <rect
                          x={el.width - 8}
                          y={el.height - 8}
                          width={8}
                          height={8}
                          fill="blue"
                          className="cursor-se-resize"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setResizing({
                              id: el.id,
                              startX: e.clientX,
                              startY: e.clientY,
                              startW: el.width,
                              startH: el.height,
                            });
                          }}
                        />
                      )}
                    </svg>
                  );
                }

                return null;
              })}

              {/* Alignment guides */}
              {guides.map((g, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: g.type === "v" ? 0 : g.y,
                    left: g.type === "v" ? g.x : 0,
                    width: g.type === "v" ? "1px" : "100%",
                    height: g.type === "v" ? "100%" : "1px",
                    background: "red",
                    pointerEvents: "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}