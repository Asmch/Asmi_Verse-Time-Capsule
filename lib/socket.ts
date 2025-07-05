import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export const initSocket = (server: NetServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket:any) => {
    console.log('Client connected:', socket.id);

    // Join user to their personal room
    socket.on('join-user-room', (userId: string) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Handle capsule creation
    socket.on('capsule-created', (data:any) => {
      socket.broadcast.emit('capsule-update', {
        type: 'created',
        data
      });
    });

    // Handle capsule unlock
    socket.on('capsule-unlocked', (data:any) => {
      io.emit('capsule-update', {
        type: 'unlocked',
        data
      });
    });

    // Handle real-time notifications
    socket.on('send-notification', (data:any) => {
      const { recipientId, notification } = data;
      io.to(`user-${recipientId}`).emit('new-notification', notification);
    });

    // Handle typing indicators
    socket.on('typing-start', (data:any) => {
      socket.broadcast.emit('user-typing', {
        userId: data.userId,
        isTyping: true
      });
    });

    socket.on('typing-stop', (data:any) => {
      socket.broadcast.emit('user-typing', {
        userId: data.userId,
        isTyping: false
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export default initSocket; 