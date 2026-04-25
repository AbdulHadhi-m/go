import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a room specifically for this user so we can emit private notifications
    socket.on('join_user_room', (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`Socket ${socket.id} joined user room: ${userId}`);
      }
    });

    socket.on('leave_user_room', (userId) => {
      if (userId) {
        socket.leave(userId);
        console.log(`Socket ${socket.id} left user room: ${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};
