import { create } from 'zustand';

const useStore = create((set) => ({
  // Active tool: 'pencil', 'line', 'rectangle', 'circle', 'text', 'eraser', 'select'
  activeTool: 'pencil',
  setActiveTool: (tool) => set({ activeTool: tool }),

  // Properties
  strokeColor: '#000000',
  setStrokeColor: (color) => set({ strokeColor: color }),
  
  fillColor: 'transparent',
  setFillColor: (color) => set({ fillColor: color }),

  strokeWidth: 2,
  setStrokeWidth: (width) => set({ strokeWidth: width }),

  strokeStyle: 'solid', // 'solid', 'dashed', 'dotted', 'dash-dot'
  setStrokeStyle: (style) => set({ strokeStyle: style }),

  tableRows: 3,
  setTableRows: (rows) => set({ tableRows: rows }),
  tableCols: 3,
  setTableCols: (cols) => set({ tableCols: cols }),

  // Elements
  elements: [],
  selectedElement: null,
  setSelectedElement: (element) => set({ selectedElement: element }),
  setElements: (elements) => set({ elements }),
  addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
  updateElement: (id, updatedElement) => set((state) => ({
    elements: state.elements.map(el => el.id === id ? { ...el, ...updatedElement } : el)
  })),

  // History for Undo/Redo
  history: [[]],
  historyIndex: 0,
  
  // This will be called after a completed drawing action to push state to history
  pushToHistory: (newElements) => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    return {
      history: [...newHistory, newElements],
      historyIndex: newHistory.length,
      elements: newElements
    };
  }),

  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      return {
        historyIndex: newIndex,
        elements: state.history[newIndex]
      };
    }
    return state;
  }),

  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      return {
        historyIndex: newIndex,
        elements: state.history[newIndex]
      };
    }
    return state;
  })
}));

export default useStore;
