export const drawElement = (ctx, element) => {
  ctx.beginPath();
  ctx.strokeStyle = element.color || '#000000';
  ctx.lineWidth = element.strokeWidth || 2;
  ctx.fillStyle = element.fillColor || 'transparent';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const w = element.strokeWidth || 2;
  switch (element.strokeStyle) {
    case 'dashed':
      ctx.setLineDash([w * 3, w * 3]);
      break;
    case 'dotted':
      ctx.setLineDash([1, w * 2]);
      break;
    case 'dash-dot':
      ctx.setLineDash([w * 3, w * 2, 1, w * 2]);
      break;
    default:
      ctx.setLineDash([]); // solid
  }

  switch (element.type) {
    case 'pencil':
    case 'eraser':
      if (element.points && element.points.length > 0) {
        ctx.moveTo(element.points[0].x, element.points[0].y);
        for (let i = 1; i < element.points.length; i++) {
          ctx.lineTo(element.points[i].x, element.points[i].y);
        }
        if (element.type === 'eraser') {
          ctx.strokeStyle = '#ffffff'; // White for eraser (assuming white background)
          // To make eraser thicker, we can multiply strokeWidth, or just use what's given
          ctx.lineWidth = element.strokeWidth * 5; 
        }
        ctx.stroke();
      }
      break;

    case 'line':
      ctx.moveTo(element.x, element.y);
      ctx.lineTo(element.x + element.width, element.y + element.height);
      ctx.stroke();
      break;

    case 'rectangle': {
      const rectX = Math.min(element.x, element.x + element.width);
      const rectY = Math.min(element.y, element.y + element.height);
      const rectW = Math.abs(element.width);
      const rectH = Math.abs(element.height);

      if (element.borderRadius && element.borderRadius > 0 && ctx.roundRect) {
        const maxRadius = Math.min(rectW, rectH) / 2;
        const radius = Math.min(element.borderRadius, maxRadius);
        ctx.roundRect(rectX, rectY, rectW, rectH, radius);
      } else {
        ctx.rect(element.x, element.y, element.width, element.height);
      }
      if (element.fillColor !== 'transparent') ctx.fill();
      ctx.stroke();
      break;
    }

    case 'table': {
      const rectX = Math.min(element.x, element.x + element.width);
      const rectY = Math.min(element.y, element.y + element.height);
      const rectW = Math.abs(element.width);
      const rectH = Math.abs(element.height);

      ctx.rect(element.x, element.y, element.width, element.height);
      if (element.fillColor !== 'transparent') ctx.fill();
      ctx.stroke();

      const rows = element.rows || 3;
      const cols = element.cols || 3;
      
      ctx.beginPath();
      for (let i = 1; i < rows; i++) {
        const y = rectY + (rectH / rows) * i;
        ctx.moveTo(rectX, y);
        ctx.lineTo(rectX + rectW, y);
      }
      for (let i = 1; i < cols; i++) {
        const x = rectX + (rectW / cols) * i;
        ctx.moveTo(x, rectY);
        ctx.lineTo(x, rectY + rectH);
      }
      ctx.stroke();
      break;
    }

    case 'circle':
      const radiusX = Math.abs(element.width / 2);
      const radiusY = Math.abs(element.height / 2);
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      if (element.fillColor !== 'transparent') ctx.fill();
      ctx.stroke();
      break;

    case 'text':
      ctx.font = `${element.strokeWidth * 10}px sans-serif`;
      ctx.fillStyle = element.color;
      ctx.fillText(element.text, element.x, element.y);
      break;

    default:
      break;
  }
};

export const redrawCanvas = (canvas, ctx, elements) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Redraw all elements
  elements.forEach((element) => {
    drawElement(ctx, element);
  });
};
