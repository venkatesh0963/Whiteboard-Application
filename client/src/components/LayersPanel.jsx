import React from 'react';
import useStore from '../store/useStore';
import { Layers, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

const LayersPanel = () => {
  const { elements, setElements, selectedElement, setSelectedElement, pushToHistory } = useStore();

  const handlePropChange = (id, key, val) => {
    const newElements = elements.map(el => el.id === id ? { ...el, [key]: Number(val) || 0 } : el);
    setElements(newElements);
  };

  const handlePropChangeEnd = () => {
    pushToHistory(elements);
  };

  const moveUp = (index) => {
    if (index === elements.length - 1) return;
    const newElements = [...elements];
    const temp = newElements[index];
    newElements[index] = newElements[index + 1];
    newElements[index + 1] = temp;
    setElements(newElements);
  };

  const moveDown = (index) => {
    if (index === 0) return;
    const newElements = [...elements];
    const temp = newElements[index];
    newElements[index] = newElements[index - 1];
    newElements[index - 1] = temp;
    setElements(newElements);
  };

  const deleteElement = (index) => {
    const newElements = elements.filter((_, i) => i !== index);
    setElements(newElements);
    if (selectedElement && selectedElement.id === elements[index].id) {
      setSelectedElement(null);
    }
  };

  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col h-full shadow-sm z-10">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2 text-gray-700">
        <Layers size={20} />
        <h3 className="font-medium">Layers</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {elements.map((el, idx) => {
          // Display in reverse order so top layer is at the top of the list
          const displayIdx = elements.length - 1 - idx;
          const element = elements[displayIdx];
          const isSelected = selectedElement && selectedElement.id === element.id;

          return (
            <div key={element.id} className="flex flex-col mb-1">
              <div 
                onClick={() => setSelectedElement(element)}
                className={`flex items-center justify-between p-2 rounded-lg text-sm cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50 border border-transparent'}`}
              >
                <div className="flex items-center gap-2 truncate flex-1">
                  <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: element.color || '#000' }}></span>
                  <span className="capitalize text-gray-600 truncate">{element.type}</span>
                </div>
                <div className="flex items-center opacity-50 hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); moveUp(displayIdx); pushToHistory(elements); }} className="p-1 hover:bg-gray-200 rounded" title="Bring Forward">
                    <ChevronUp size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); moveDown(displayIdx); pushToHistory(elements); }} className="p-1 hover:bg-gray-200 rounded" title="Send Backward">
                    <ChevronDown size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteElement(displayIdx); pushToHistory(elements); }} className="p-1 text-red-500 hover:bg-red-50 rounded ml-1" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {isSelected && ['rectangle', 'circle', 'line', 'table'].includes(element.type) && (
                <div className="bg-indigo-50/50 p-2 border-x border-b border-indigo-100 rounded-b-lg -mt-1 pt-3 text-xs flex flex-col gap-2">
                  <div className="flex gap-2">
                    <label className="flex flex-col flex-1">
                      <span className="text-gray-500 mb-1">X</span>
                      <input type="number" value={Math.round(element.x)} onChange={(e) => handlePropChange(element.id, 'x', e.target.value)} onBlur={handlePropChangeEnd} className="w-full p-1 border border-gray-200 rounded" />
                    </label>
                    <label className="flex flex-col flex-1">
                      <span className="text-gray-500 mb-1">Y</span>
                      <input type="number" value={Math.round(element.y)} onChange={(e) => handlePropChange(element.id, 'y', e.target.value)} onBlur={handlePropChangeEnd} className="w-full p-1 border border-gray-200 rounded" />
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <label className="flex flex-col flex-1">
                      <span className="text-gray-500 mb-1">Width</span>
                      <input type="number" value={Math.round(element.width)} onChange={(e) => handlePropChange(element.id, 'width', e.target.value)} onBlur={handlePropChangeEnd} className="w-full p-1 border border-gray-200 rounded" />
                    </label>
                    <label className="flex flex-col flex-1">
                      <span className="text-gray-500 mb-1">Height</span>
                      <input type="number" value={Math.round(element.height)} onChange={(e) => handlePropChange(element.id, 'height', e.target.value)} onBlur={handlePropChangeEnd} className="w-full p-1 border border-gray-200 rounded" />
                    </label>
                  </div>
                  {element.type === 'rectangle' && (
                    <div className="flex gap-2">
                      <label className="flex flex-col flex-1">
                        <span className="text-gray-500 mb-1">Border Radius</span>
                        <input type="number" min="0" value={Math.round(element.borderRadius || 0)} onChange={(e) => handlePropChange(element.id, 'borderRadius', e.target.value)} onBlur={handlePropChangeEnd} className="w-full p-1 border border-gray-200 rounded" />
                      </label>
                    </div>
                  )}
                  {element.type === 'table' && (
                    <div className="flex gap-2">
                      <label className="flex flex-col flex-1">
                        <span className="text-gray-500 mb-1">Rows</span>
                        <input type="number" min="1" max="50" value={Math.round(element.rows || 3)} onChange={(e) => handlePropChange(element.id, 'rows', e.target.value)} onBlur={handlePropChangeEnd} className="w-full p-1 border border-gray-200 rounded" />
                      </label>
                      <label className="flex flex-col flex-1">
                        <span className="text-gray-500 mb-1">Cols</span>
                        <input type="number" min="1" max="50" value={Math.round(element.cols || 3)} onChange={(e) => handlePropChange(element.id, 'cols', e.target.value)} onBlur={handlePropChangeEnd} className="w-full p-1 border border-gray-200 rounded" />
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {elements.length === 0 && (
          <div className="text-center p-4 text-gray-400 text-sm">
            No layers yet
          </div>
        )}
      </div>
    </div>
  );
};

export default LayersPanel;
