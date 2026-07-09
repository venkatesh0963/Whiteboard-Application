import React from 'react';
import { Pencil, Square, Circle, Minus, Type, Eraser, Undo, Redo, Download, Save, MousePointer2, Grid } from 'lucide-react';
import useStore from '../store/useStore';

const Toolbar = () => {
  const { activeTool, setActiveTool, undo, redo, strokeColor, setStrokeColor, strokeWidth, setStrokeWidth, strokeStyle, setStrokeStyle, tableRows, setTableRows, tableCols, setTableCols } = useStore();

  const tools = [
    { id: 'select', icon: <MousePointer2 size={20} />, title: 'Select' },
    { id: 'pencil', icon: <Pencil size={20} />, title: 'Pencil' },
    { id: 'rectangle', icon: <Square size={20} />, title: 'Rectangle' },
    { id: 'circle', icon: <Circle size={20} />, title: 'Circle' },
    { id: 'line', icon: <Minus size={20} />, title: 'Line' },
    { id: 'table', icon: <Grid size={20} />, title: 'Table' },
    { id: 'text', icon: <Type size={20} />, title: 'Text' },
    { id: 'eraser', icon: <Eraser size={20} />, title: 'Eraser' },
  ];

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 shadow-sm z-10 overflow-y-auto">
      <div className="space-y-3 w-full flex flex-col items-center">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`p-2 rounded-lg transition-colors w-10 h-10 flex items-center justify-center ${
              activeTool === tool.id 
                ? 'bg-indigo-100 text-indigo-600' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            title={tool.title}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="w-full h-px bg-gray-200 my-4"></div>

      <div className="flex flex-col items-center space-y-3 w-full px-2">
        <input 
          type="color" 
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0 p-0"
          title="Color"
        />
        
        <div className="w-full flex flex-col items-center gap-1" title="Stroke Width">
          <span className="text-[10px] text-gray-500 font-medium">Size</span>
          <select 
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-full text-xs border border-gray-200 rounded p-1"
          >
            <option value={1}>1px</option>
            <option value={2}>2px</option>
            <option value={4}>4px</option>
            <option value={8}>8px</option>
            <option value={12}>12px</option>
          </select>
        </div>

        <div className="w-full flex flex-col items-center gap-1 mt-2" title="Stroke Style">
          <span className="text-[10px] text-gray-500 font-medium">Style</span>
          <select 
            value={strokeStyle}
            onChange={(e) => setStrokeStyle(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded p-1"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
            <option value="dash-dot">Dash-Dot</option>
          </select>
        </div>

        {activeTool === 'table' && (
          <div className="w-full flex flex-col items-center gap-2 mt-2 pt-2 border-t border-gray-200" title="Table Size">
            <label className="flex flex-col items-center w-full">
              <span className="text-[10px] text-gray-500 font-medium">Rows</span>
              <input type="number" min="1" max="20" value={tableRows} onChange={(e) => setTableRows(Number(e.target.value))} className="w-full text-xs border border-gray-200 rounded p-1 text-center" />
            </label>
            <label className="flex flex-col items-center w-full">
              <span className="text-[10px] text-gray-500 font-medium">Cols</span>
              <input type="number" min="1" max="20" value={tableCols} onChange={(e) => setTableCols(Number(e.target.value))} className="w-full text-xs border border-gray-200 rounded p-1 text-center" />
            </label>
          </div>
        )}
      </div>

      <div className="mt-auto space-y-3 w-full flex flex-col items-center pb-2">
        <button onClick={undo} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors w-10 h-10 flex items-center justify-center" title="Undo">
          <Undo size={20} />
        </button>
        <button onClick={redo} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors w-10 h-10 flex items-center justify-center" title="Redo">
          <Redo size={20} />
        </button>
        <button onClick={() => {
          // Trigger save via Whiteboard component or custom event, but here we can just fire a generic event or let Whiteboard handle it.
          // Since save logic is in Whiteboard.jsx, let's just trigger a click on a hidden button or use a custom event.
          window.dispatchEvent(new CustomEvent('save-board'));
        }} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors w-10 h-10 flex items-center justify-center" title="Save Board">
          <Save size={20} />
        </button>
        <button onClick={() => {
          const canvas = document.querySelector('canvas');
          if (canvas) {
            const link = document.createElement('a');
            link.download = 'whiteboard.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
          }
        }} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors w-10 h-10 flex items-center justify-center" title="Download PNG">
          <Download size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
