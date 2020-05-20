const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const cors = require ('cors');
const { addUser, removeUser, getUser } = require('./users.js');

const PORT = 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const putRooms = [];
const usersOnServers = [];

app.use(cors()); 

io.on('connection', (socket) => {

    socket.on('join', ({name, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room});
        if(error) return callback(error);
        const found = usersOnServers.some(user => user.name === name);
        if (found === false  && putRooms.includes(user.room) === true)
        {
            myUser = {id: socket.id, name: name.trim().toLowerCase(), room: room.trim().toLowerCase(), admin: false}
            usersOnServers.push(myUser);
        }
        else if (found === false && putRooms.includes(user.room) === false )
        {
            myUser = {id: socket.id, name: name.trim().toLowerCase(), room: room.trim().toLowerCase(), admin: true}
            usersOnServers.push(myUser);
        }
        else
        {
            const error = 'Usernamel already taken on the server !';
            return callback(error);
        }
        socket.emit('message', {user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined`});
        socket.join(user.room);
           
        putRooms.push(user.room);


        //const countRoom = putRooms.reduce((a,b)=>a.set(b,a.get(b)+1||1),new Map);

        const setRooms = new Set(putRooms);
        const rooms = [...setRooms];
        var usersRoom = [];
        usersOnServers.forEach((el) => el.room === user.room ?  usersRoom.push(el) : null );
        io.to(user.room).emit('roomData', { room: user.room, users: usersRoom });
        io.sockets.emit('rooms',  rooms);
        //console.log(usersOnServers);
        callback();
    });
    socket.on('addChannel', ({name, room}, callback) => {
        const findId = usersOnServers.find(user => user.name === name);
        const { error, user } = addUser({ id: findId.id, name, room});
        if(error) return callback(error);
        if(putRooms.includes(user.room) === false)
        {
            myUser = {id: findId.id, name: name.trim().toLowerCase(), room: room.trim().toLowerCase(), admin: true}
            usersOnServers.push(myUser);
        }
        else
        {
            myUser = {id: findId.id, name: name.trim().toLowerCase(), room: room.trim().toLowerCase(), admin: false}
            usersOnServers.push(myUser);
        }
        socket.emit('message', {user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined`});
        socket.join(user.room);
        putRooms.push(user.room);
        const setRooms = new Set(putRooms);
        const rooms = [...setRooms];
        var usersRoom = [];
        usersOnServers.forEach((el) => el.room === user.room ?  usersRoom.push(el) : null );
        io.to(user.room).emit('roomData', { room: user.room, users: usersRoom});
        io.sockets.emit('rooms',  rooms);
        console.log(usersOnServers);
        callback();
    });
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        console.log(user)
        var usersRoom = [];
        usersOnServers.forEach((el) => el.room === user.room ?  usersRoom.push(el) : null );
        io.to(user.room).emit('message', { user: user.name, text: message});
        io.to(user.room).emit('roomData', { room: user.room, users: usersRoom});
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
    socket.on('deleteChannel', ({room}, callback) => {

        io.to(room).emit('deleteRoom');
        // usersOnServers.filter(obj => { obj.room === room ?})

        for (let i = putRooms.length - 1; i >= 0; i--) {
            if (putRooms[i] === room) {
              putRooms.splice(i, 1);
            }
          }
        //   console.log(user);
        // io.to(user.room).emit('message',  callback(alert('admin close this channel')));
       
    });
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user){
            //const inRoom = getUsersInRoom(user.room);
                var index = putRooms.indexOf(user.room);
                if (index !== -1) putRooms.splice(index, 1);
            usersOnServers.forEach((el, index) => el.name === user.name && el.room === user.room ? usersOnServers.splice(index, 1) : null );
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left`});
            const setRooms = new Set(putRooms);
            const rooms = [...setRooms];
            io.sockets.emit('rooms',  rooms)
        }
    });
});

app.use(router);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));