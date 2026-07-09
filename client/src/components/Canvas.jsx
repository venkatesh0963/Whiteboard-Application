import React, { useRef, useEffect } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import useStore from '../store/useStore';

const Canvas = () => {
  const canvasRef = useRef(null);
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvas(canvasRef);
  const { activeTool } = useStore();

  useEffect(() => {
    // Handle resize
    const handleResize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        canvasRef.current.width = parent.clientWidth;
        canvasRef.current.height = parent.clientHeight;
        // Need to trigger a redraw here if possible, but store state change will handle it
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Init size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex-1 bg-gray-200 overflow-hidden relative touch-none">
      <canvas 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`bg-white shadow-md block ${activeTool === 'text' ? 'cursor-text' : (activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair')}`}
      />
    </div>
  );
};

export default Canvas;
