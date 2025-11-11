export default function TableComponent({ 
  element, 
  updateElement, 
  isSelected, 
  onSelect, 
  onDragStart, 
  onResizeStart 
}) {
  const { 
    x, 
    y, 
    width, 
    height, 
    rows = 3, 
    cols = 3, 
    borderWidth = 1, 
    borderColor = "#000", 
    cellPadding = 5,
    fontSize = 12,
    fontFamily = "Arial",
    textColor = "#000",
    backgroundColor = "transparent"
  } = element;

  const cellWidth = width / cols;
  const cellHeight = height / rows;

  const handleCellClick = (rowIndex, colIndex) => {
    if (!isSelected) {
      onSelect();
      return;
    }
    
    // Handle cell editing if needed
    const cellKey = `cell_${rowIndex}_${colIndex}`;
    const currentText = element.cellData?.[cellKey] || '';
    const newText = prompt('Enter cell text:', currentText);
    
    if (newText !== null) {
      const newCellData = { ...element.cellData, [cellKey]: newText };
      updateElement(element.id, 'cellData', newCellData);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        border: isSelected ? '2px solid #3b82f6' : 'none',
        cursor: 'move'
      }}
      onClick={onSelect}
      onMouseDown={(e) => {
        e.preventDefault();
        onDragStart(e, element.id);
      }}
    >
      <table
        style={{
          width: '100%',
          height: '100%',
          borderCollapse: 'collapse',
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
                const cellText = element.cellData?.[cellKey] || '';
                
                return (
                  <td
                    key={colIndex}
                    style={{
                      border: `${borderWidth}px solid ${borderColor}`,
                      padding: `${cellPadding}px`,
                      width: `${cellWidth}px`,
                      height: `${cellHeight}px`,
                      textAlign: 'left',
                      verticalAlign: 'top',
                      cursor: 'text',
                      overflow: 'hidden',
                      wordWrap: 'break-word'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCellClick(rowIndex, colIndex);
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
      
      {/* Resize Handle */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            bottom: -5,
            right: -5,
            width: 10,
            height: 10,
            backgroundColor: '#3b82f6',
            cursor: 'se-resize',
            borderRadius: '2px'
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart(e, element.id);
          }}
        />
      )}
    </div>
  );
}