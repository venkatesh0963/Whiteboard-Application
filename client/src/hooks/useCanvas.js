import { useEffect, useState, useRef } from 'react';
import useStore from '../store/useStore';
import { redrawCanvas } from '../utils/drawing';
import { getElementAtPosition, getResizeHandle } from '../utils/math';

export const useCanvas = (canvasRef) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState(null);
  
  const { 
    activeTool, 
    strokeColor, 
    strokeWidth, 
    elements, 
    addElement, 
    updateElement,
    pushToHistory,
    selectedElement,
    setSelectedElement
  } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    redrawCanvas(canvas, ctx, elements);
    
    // Draw current drawing element
    if (currentElement) {
      import('../utils/drawing').then(({ drawElement }) => {
        drawElement(ctx, currentElement);
      });
    }

    // Highlight selected element
    if (selectedElement && (!isDrawing || activeTool === 'select')) {
      const el = elements.find(e => e.id === selectedElement.id);
      if (el) {
        ctx.save();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        if (['rectangle', 'circle', 'line', 'text', 'table'].includes(el.type)) {
          // Bounding box approximation
          let minX = el.x, minY = el.y, maxX = el.x + (el.width || 0), maxY = el.y + (el.height || 0);
          if (el.type === 'circle') {
             minX = el.x; maxX = el.x + el.width;
             minY = el.y; maxY = el.y + el.height;
          }
          if (el.type === 'text') {
             minY = el.y - (el.strokeWidth * 10);
             maxX = el.x + (el.text.length * el.strokeWidth * 6);
          }
          ctx.strokeRect(
            Math.min(minX, maxX) - 5,
            Math.min(minY, maxY) - 5,
            Math.abs(maxX - minX) + 10,
            Math.abs(maxY - minY) + 10
          );
          
          if (['rectangle', 'circle', 'line', 'table'].includes(el.type)) {
            const hs = 10;
            const hhs = hs / 2;
            ctx.fillStyle = 'white';
            ctx.strokeStyle = '#3b82f6';
            ctx.setLineDash([]);
            ctx.lineWidth = 1;
            
            const drawH = (hx, hy) => {
              ctx.fillRect(hx - hhs, hy - hhs, hs, hs);
              ctx.strokeRect(hx - hhs, hy - hhs, hs, hs);
            };
            
            drawH(minX, minY);
            drawH(maxX, minY);
            drawH(minX, maxY);
            drawH(maxX, maxY);
          }
        }
        ctx.restore();
      }
    }
  }, [elements, currentElement, selectedElement, isDrawing, canvasRef]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getMousePos(e);
    setIsDrawing(true);

    // 1. Always check if clicking on a resize handle first, even if not in select mode
    if (selectedElement) {
      const handle = getResizeHandle(x, y, selectedElement);
      if (handle) {
        setResizeHandle(handle);
        setDragOffset({ x, y });
        // Automatically switch to select tool to process the resize
        useStore.getState().setActiveTool('select');
        return;
      }
    }

    if (activeTool === 'select') {
      const element = getElementAtPosition(x, y, elements);
      if (element) {
        setSelectedElement(element);
        setDragOffset({ x, y }); // Store initial click position
      } else {
        setSelectedElement(null);
      }
      return;
    }

    // Reset selection when starting to draw
    setSelectedElement(null);

    if (activeTool === 'pencil' || activeTool === 'eraser') {
      setCurrentElement({
        id: generateId(),
        type: activeTool,
        color: strokeColor,
        strokeWidth,
        strokeStyle: activeTool === 'eraser' ? 'solid' : useStore.getState().strokeStyle,
        points: [{ x, y }]
      });
    } else if (['line', 'rectangle', 'circle', 'table'].includes(activeTool)) {
      setCurrentElement({
        id: generateId(),
        type: activeTool,
        x,
        y,
        width: 0,
        height: 0,
        color: strokeColor,
        strokeWidth,
        strokeStyle: useStore.getState().strokeStyle,
        rows: activeTool === 'table' ? useStore.getState().tableRows : undefined,
        cols: activeTool === 'table' ? useStore.getState().tableCols : undefined,
      });
    } else if (activeTool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const newElement = {
          id: generateId(),
          type: 'text',
          x,
          y,
          text,
          color: strokeColor,
          strokeWidth,
        };
        addElement(newElement);
        pushToHistory([...elements, newElement]);
      }
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { x, y } = getMousePos(e);

    if (activeTool === 'select' && selectedElement) {
      const dx = x - dragOffset.x;
      const dy = y - dragOffset.y;
      
      if (resizeHandle) {
        const updatedElements = elements.map(el => {
          if (el.id === selectedElement.id) {
            let newEl = { ...el };
            if (resizeHandle === 'tl') {
              newEl.x = el.x + dx;
              newEl.y = el.y + dy;
              newEl.width = (el.width || 0) - dx;
              newEl.height = (el.height || 0) - dy;
            } else if (resizeHandle === 'tr') {
              newEl.y = el.y + dy;
              newEl.width = (el.width || 0) + dx;
              newEl.height = (el.height || 0) - dy;
            } else if (resizeHandle === 'bl') {
              newEl.x = el.x + dx;
              newEl.width = (el.width || 0) - dx;
              newEl.height = (el.height || 0) + dy;
            } else if (resizeHandle === 'br') {
              newEl.width = (el.width || 0) + dx;
              newEl.height = (el.height || 0) + dy;
            }
            return newEl;
          }
          return el;
        });
        
        setDragOffset({ x, y });
        useStore.getState().setElements(updatedElements);
        return;
      }
      
      const updatedElements = elements.map(el => {
        if (el.id === selectedElement.id) {
          if (el.type === 'pencil' || el.type === 'eraser') {
            const newPoints = el.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
            return { ...el, points: newPoints };
          } else {
            return {
              ...el,
              x: el.x + dx,
              y: el.y + dy
            };
          }
        }
        return el;
      });
      
      // Update drag offset for continuous moving
      setDragOffset({ x, y });
      
      // Update store elements instantly
      useStore.getState().setElements(updatedElements);
      return;
    }

    if (!currentElement) return;

    if (activeTool === 'pencil' || activeTool === 'eraser') {
      setCurrentElement({
        ...currentElement,
        points: [...currentElement.points, { x, y }]
      });
    } else if (['line', 'rectangle', 'circle', 'table'].includes(activeTool)) {
      setCurrentElement({
        ...currentElement,
        width: x - currentElement.x,
        height: y - currentElement.y
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;

    if (activeTool === 'select' && selectedElement) {
      // Drag or resize ended, push to history
      pushToHistory(elements);
      setResizeHandle(null);
    } else if (currentElement) {
      addElement(currentElement);
      pushToHistory([...elements, currentElement]);
      setCurrentElement(null);
      
      // Auto-select so handles appear instantly
      if (['rectangle', 'circle', 'line', 'table'].includes(currentElement.type)) {
        useStore.getState().setSelectedElement(currentElement);
      }
    }
    
    setIsDrawing(false);
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
