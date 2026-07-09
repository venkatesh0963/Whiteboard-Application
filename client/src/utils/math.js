// Check if a point is near a line segment
export const isPointNearLine = (x, y, x1, y1, x2, y2, threshold = 5) => {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;
  if (len_sq !== 0) //in case of 0 length line
      param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy) < threshold;
};

// Check if point is inside a rectangle
export const isPointInRect = (x, y, rectX, rectY, width, height) => {
  const minX = Math.min(rectX, rectX + width);
  const maxX = Math.max(rectX, rectX + width);
  const minY = Math.min(rectY, rectY + height);
  const maxY = Math.max(rectY, rectY + height);

  return x >= minX && x <= maxX && y >= minY && y <= maxY;
};

// Check if point is inside a circle/ellipse
export const isPointInCircle = (x, y, rectX, rectY, width, height) => {
  const radiusX = Math.abs(width / 2);
  const radiusY = Math.abs(height / 2);
  const centerX = rectX + width / 2;
  const centerY = rectY + height / 2;

  // Normalized distance formula for ellipse
  const dx = (x - centerX) / radiusX;
  const dy = (y - centerY) / radiusY;
  
  return (dx * dx + dy * dy) <= 1;
};

export const getElementAtPosition = (x, y, elements) => {
  // Search from top to bottom (last drawn to first)
  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i];
    
    switch (element.type) {
    case 'rectangle':
    case 'table':
        if (isPointInRect(x, y, element.x, element.y, element.width, element.height)) {
          return { ...element, index: i };
        }
        break;
      case 'circle':
        if (isPointInCircle(x, y, element.x, element.y, element.width, element.height)) {
          return { ...element, index: i };
        }
        break;
      case 'line':
        if (isPointNearLine(x, y, element.x, element.y, element.x + element.width, element.y + element.height)) {
          return { ...element, index: i };
        }
        break;
      case 'pencil':
      case 'eraser':
        for (let j = 0; j < element.points.length - 1; j++) {
          const p1 = element.points[j];
          const p2 = element.points[j+1];
          if (isPointNearLine(x, y, p1.x, p1.y, p2.x, p2.y, element.strokeWidth + 3)) {
            return { ...element, index: i };
          }
        }
        break;
      case 'text':
        // Rough bounding box for text based on font size (strokeWidth * 10)
        const fontSize = element.strokeWidth * 10;
        // Approximating text width
        const approxWidth = element.text.length * (fontSize * 0.6); 
        if (x >= element.x && x <= element.x + approxWidth && y >= element.y - fontSize && y <= element.y) {
          return { ...element, index: i };
        }
        break;
    }
  }
  return null;
};

// Get bounding box for an element
export const getBoundingBox = (el) => {
  if (['rectangle', 'circle', 'line', 'table'].includes(el.type)) {
    let minX = el.x, minY = el.y, maxX = el.x + (el.width || 0), maxY = el.y + (el.height || 0);
    if (el.type === 'circle') {
       minX = el.x; maxX = el.x + el.width;
       minY = el.y; maxY = el.y + el.height;
    }
    return {
      minX: Math.min(minX, maxX),
      minY: Math.min(minY, maxY),
      maxX: Math.max(minX, maxX),
      maxY: Math.max(minY, maxY),
    };
  }
  return null;
};

// Check if clicked on a resize handle
export const getResizeHandle = (x, y, element) => {
  const box = getBoundingBox(element);
  if (!box) return null;
  const { minX, minY, maxX, maxY } = box;
  const hs = 10; // handle size
  
  if (isPointInRect(x, y, minX - hs/2, minY - hs/2, hs, hs)) return 'tl';
  if (isPointInRect(x, y, maxX - hs/2, minY - hs/2, hs, hs)) return 'tr';
  if (isPointInRect(x, y, minX - hs/2, maxY - hs/2, hs, hs)) return 'bl';
  if (isPointInRect(x, y, maxX - hs/2, maxY - hs/2, hs, hs)) return 'br';
  
  return null;
};

