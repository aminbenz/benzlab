require('dotenv').config();
const http = require('http');
const path = require('path');
const os = require('os');
const cors = require('cors');
const { Server } = require('socket.io');
const express = require('express');

const app = express();
const server = http.createServer(app);

const formatMessage = require('./utils/formatMessage');
const {
  userJoinRoom,
  getUser,
  userLeave,
  getUsersInRoom,
  getChannels,
} = require('./utils/users');
const generateRandomColor = require('./utils/generateRandomColor');
const { secondsToHms, bytesToSize } = require('./helpers/convert');

// app.use(express.static(path.join(__dirname, 'public')))
app.use(cors());
app.use(express.json());

const systeme = {
  os: {
    version: os.version(),
    type: os.type(),
    platform: os.platform(),
    release: os.release(),
  },
  ram: {
    size: bytesToSize(os.totalmem()),
    freeMemory: bytesToSize(os.freemem()),
    sizeInBytes: os.totalmem(),
    freeMemoryInBytes: os.freemem(),
  },
  cpu: {
    model: os.cpus()[0].model,
    cores: os.cpus().length,
    speedGHz: os.cpus()[0].model.substring(os.cpus()[0].model.indexOf('@') + 1),
    speedMHz: os.cpus()[0].speed,
    arch: os.arch(),
    // ...os.cpus(),
  },
  pc: {
    name: os.hostname(),
    pcName: os.userInfo().username,
    uptime: secondsToHms(os.uptime()),
    uptimeInSec: os.uptime(),
  },
  network: {
    ...os.networkInterfaces(),
  },
};

app.get('/api/os', (req, res) => {
  res.status(200).json({ success: true, systeme });
});

// app.get('/', (req, res) => {
//   res.send('hello,  world');
// });

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  const botName = 'PT';

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoinRoom(socket.id, username, room, generateRandomColor());
    // channels
    io.emit('channelsData', {
      channels: getChannels(),
      length: getChannels().length,
    });

    // join room
    socket.join(user.room);

    // welcome to current user
    socket.broadcast
      .to(user.room)
      .emit(
        'sendMessage',
        formatMessage(botName, `@${user.username} Has joined to ${user.room}`)
      );

    // user send message
    socket.on('chatMessage', ({ message, media }) => {
      const currentUser = getUser(socket.id);
      io.to(user.room).emit(
        'sendMessage',
        formatMessage(
          currentUser.displayName,
          message,
          currentUser.hexColor,
          media
        )
      );
    });

    // send users and room info
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  // disconnect
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    // user Leave
    if (user) {
      io.to(user.room).emit(
        'sendMessage',
        formatMessage(botName, `@${user.username} has left the chat`)
      );

      // send users and room info
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`server listen in PORT : ${PORT}`);
});
