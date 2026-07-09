import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useStore from '../store/useStore';

const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

export const useSocket = (boardId) => {
  const socketRef = useRef(null);
  const { setElements, elements } = useStore();
  
  // Track previous elements length to only broadcast new additions,
  // or broadcast full state. For simplicity, we broadcast full state on change.
  // A better approach is broadcasting just the delta (the new element or modified element).

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    
    socketRef.current.emit('join-board', boardId);
    
    socketRef.current.on('update-elements', (newElements) => {
      setElements(newElements);
    });

    socketRef.current.on('element-updated', (element) => {
      // Handles partial updates like moving/resizing
      useStore.getState().updateElement(element.id, element);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [boardId]);

  const broadcastElements = (elements) => {
    if (socketRef.current) {
      socketRef.current.emit('draw-elements', { boardId, elements });
    }
  };

  const broadcastElementUpdate = (element) => {
    if (socketRef.current) {
      socketRef.current.emit('update-element', { boardId, element });
    }
  };

  return {
    socket: socketRef.current,
    broadcastElements,
    broadcastElementUpdate
  };
};
