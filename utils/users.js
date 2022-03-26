const users = [];

const userJoinRoom = (socketId, username, room, hexColor) => {
  const user = {
    username: username.split(' ').join(''),
    displayName: username,
    room,
    socketId,
    hexColor,
    role: username === 'aminbenz' ? 'admin' : 'user',
  };
  if (!users.includes(user)) {
    users.push(user);
  }
  return user;
};

const getUser = (socketId) => users.find((user) => user.socketId === socketId);

const userLeave = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

const getChannels = () => {
  return users.map((user) => user.room);
};

module.exports = {
  userJoinRoom,
  getUser,
  userLeave,
  getUsersInRoom,
  users,
  getChannels,
};
