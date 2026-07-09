export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins a specific board room
    socket.on('join-board', (boardId) => {
      socket.join(boardId);
      console.log(`Socket ${socket.id} joined board ${boardId}`);
    });

    // Handle drawing events
    socket.on('draw-elements', (data) => {
      const { boardId, elements } = data;
      // Broadcast to all other users in the same room
      socket.to(boardId).emit('update-elements', elements);
    });
    
    // Handle specific element updates (e.g. moving/resizing)
    socket.on('update-element', (data) => {
      const { boardId, element } = data;
      socket.to(boardId).emit('element-updated', element);
    });

    // Handle cursor tracking
    socket.on('cursor-move', (data) => {
      const { boardId, cursor } = data;
      socket.to(boardId).emit('cursor-update', { ...cursor, socketId: socket.id });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      // In a real app we might want to broadcast that this user's cursor should be removed
    });
  });
};
