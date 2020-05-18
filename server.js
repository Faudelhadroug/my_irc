const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const cors = require ('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const putRooms = [];

app.use(cors()); 

io.on('connection', (socket) => {
    socket.on('join', ({name, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room});
        if(error) return callback(error);
        socket.emit('message', {user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined`});
        socket.join(user.room);
        putRooms.push(user.room);
        const setRooms = new Set(putRooms);
        const rooms = [...setRooms];
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        io.sockets.emit('rooms',  rooms);

        callback();
    });
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
       

        io.to(user.room).emit('message', { user: user.name, text: message});
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        const setRooms = new Set(putRooms);
        const rooms = [...setRooms];
        io.sockets.emit('rooms',  rooms);
        callback();
    });
    socket.on('getRooms', (callback) => {
        const setRooms = new Set(putRooms);
        const rooms = [...setRooms];
        io.sockets.emit('rooms',  rooms)
        callback();
    });
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user){
            const inRoom = getUsersInRoom(user.room);
                var index = putRooms.indexOf(user.room);
                if (index !== -1) putRooms.splice(index, 1);
            
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left`});
            const setRooms = new Set(putRooms);
            const rooms = [...setRooms];
            io.sockets.emit('rooms',  rooms)
        }
    });
});

app.use(router);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));