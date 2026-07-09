import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Save } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Toolbar from '../components/Toolbar';
import Canvas from '../components/Canvas';
import LayersPanel from '../components/LayersPanel';
import useStore from '../store/useStore';
import { useSocket } from '../hooks/useSocket';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Whiteboard = () => {
  const { id } = useParams();
  const [boardTitle, setBoardTitle] = useState('Untitled Board');
  const [loading, setLoading] = useState(true);
  const { elements, setElements, pushToHistory } = useStore();
  const { broadcastElements } = useSocket(id);

  const saveBoard = async () => {
    try {
      const loadingToast = toast.loading('Saving...');
      await axios.put(`${API_URL}/boards/${id}`, { title: boardTitle, elements });
      toast.dismiss(loadingToast);
      toast.success('Board saved successfully!');
    } catch (error) {
      toast.error('Failed to save board');
    }
  };

  // Broadcast elements whenever they change (debounce in a real app)
  useEffect(() => {
    if (!loading && elements.length > 0) {
      broadcastElements(elements);
    }
  }, [elements, broadcastElements, loading]);

  useEffect(() => {
    const handleSaveEvent = () => saveBoard();
    window.addEventListener('save-board', handleSaveEvent);
    return () => window.removeEventListener('save-board', handleSaveEvent);
  }, [boardTitle, elements, id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        useStore.getState().undo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        useStore.getState().redo();
      } else if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveBoard();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // Prevent deleting the object if the user is typing in an input field
        const activeTag = document.activeElement.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') {
          return;
        }

        const { selectedElement, elements, setElements, setSelectedElement } = useStore.getState();
        if (selectedElement) {
          e.preventDefault();
          setElements(elements.filter(el => el.id !== selectedElement.id));
          setSelectedElement(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveBoard]);

  useEffect(() => {
    const loadBoard = async () => {
      try {
        const res = await axios.get(`${API_URL}/boards/${id}`);
        setBoardTitle(res.data.title);
        if (res.data.elements && res.data.elements.length > 0) {
          setElements(res.data.elements);
        }
      } catch (error) {
        toast.error('Could not load board, it might be new');
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, [id, setElements]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <input 
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              className="font-semibold text-gray-800 text-sm bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors"
            />
            <span className="text-xs text-gray-400">ID: {id}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={saveBoard} className="text-gray-500 hover:text-indigo-600 transition-colors p-2" title="Save Board">
            <Save size={20} />
          </button>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold" title="You">Y</div>
          </div>
          <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium">
            <Share2 size={16} />
            Share
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <Toolbar />
        {loading ? (
           <div className="flex-1 flex justify-center items-center">Loading...</div>
        ) : (
           <Canvas />
        )}
        <LayersPanel />
      </div>
    </div>
  );
};

export default Whiteboard;
