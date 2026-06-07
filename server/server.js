const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/collabs', require('./routes/collabRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'CreativeCollab API running ✅' }));

// Socket.io
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('join-room', (roomId) => {
//     socket.join(roomId);
//     console.log(`Socket ${socket.id} joined room ${roomId}`);
//   });

//   socket.on('send-message', ({ roomId, message }) => {
//     io.to(roomId).emit('receive-message', message);
//   });

//   socket.on('task-update', ({ roomId, tasks }) => {
//     io.to(roomId).emit('tasks-updated', tasks);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  socket.on('send-message', ({ roomId, message }) => {
    io.to(roomId).emit('receive-message', message);
  });

  socket.on('task-update', ({ roomId, tasks }) => {
    io.to(roomId).emit('tasks-updated', tasks);
  });

  socket.on('disconnect', () => {
    // silently handle disconnect
  });
});

// Global error handler for Multer
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Max size is 50MB.' });
  }
  res.status(500).json({ message: err.message });
});

// DB + Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅');
    httpServer.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT} ✅`);
    });
  })
  .catch((err) => console.log('DB Error:', err));