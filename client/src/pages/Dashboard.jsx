import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Search, Palette, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await axios.get(`${API_URL}/boards`);
      setBoards(res.data);
    } catch (error) {
      toast.error('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async () => {
    try {
      const res = await axios.post(`${API_URL}/boards`, { title: 'Untitled Board' });
      navigate(`/board/${res._id || res.data._id}`);
    } catch (error) {
      toast.error('Failed to create board');
    }
  };

  const deleteBoard = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this board?')) return;
    try {
      await axios.delete(`${API_URL}/boards/${id}`);
      toast.success('Board deleted successfully');
      fetchBoards();
    } catch (error) {
      toast.error('Failed to delete board');
    }
  };

  const filteredBoards = boards.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.createdBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-600">
          <Palette size={28} />
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">PaintCraft</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search boards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 shadow-sm"
          />
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Recent Boards</h2>
          <button
            onClick={createBoard}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Plus size={20} />
            New Board
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBoards.map(board => (
              <div
                key={board._id}
                onClick={() => navigate(`/board/${board._id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 p-5 cursor-pointer transition-all hover:-translate-y-1 group relative"
              >
                <button 
                  onClick={(e) => deleteBoard(e, board._id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm"
                  title="Delete Board"
                >
                  <Trash2 size={16} />
                </button>
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <Palette className="text-gray-300 group-hover:text-indigo-300" size={48} />
                </div>
                <h3 className="font-semibold text-gray-800 truncate">{board.title}</h3>
                <p className="text-sm text-gray-500 mt-1">By {board.createdBy}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(board.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            
            {filteredBoards.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No boards found matching "{search}"
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
