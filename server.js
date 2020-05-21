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
            io.emit('message', {user: 'admin', text: `the room '${user.room}' get created`});
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
        callback();
    });

    socket.on('addChannel', ({name, room}, callback) => {
        const find = usersOnServers.find(user => user.name.trim().toLowerCase() === name.trim().toLowerCase());
        console.log(name);
        if(putRooms.includes(room) === false)
        {
            io.emit('message', {user: 'admin', text: `the room '${room}' get created`});
            myUser = {id: find.id, name: find.name.trim().toLowerCase(), room: room.trim().toLowerCase(), admin: true}
            usersOnServers.push(myUser);
        }
        else
        {
            myUser = {id: find.id, name: find.name.trim().toLowerCase(), room: room.trim().toLowerCase(), admin: false}
            usersOnServers.push(myUser);
        }
        socket.broadcast.to(room).emit('message', { user: 'admin', text: `${find.name}, has joined`});
        putRooms.push(room);
        const setRooms = new Set(putRooms);
        const rooms = [...setRooms];
        var usersRoom = [];
        usersOnServers.forEach((el) => el.room === room ?  usersRoom.push(el) : null );
        io.to(room).emit('roomData', { room: room, users: usersRoom});
        io.sockets.emit('rooms',  rooms);
        callback();
    });

    socket.on('sendMessage', (message, callback) => {
       // console.log(io.sockets.adapter.rooms);
        const find = usersOnServers.find(user => user.id === socket.id);
        const user = find;
        socket.id = user.id;
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

    socket.on('renameChannel', ({room, newNameRoom}, callback) => {
       
        io.to(room).emit('renameRoom', newNameRoom, room);
        io.emit('message', { user: 'admin', text: `The room '${room}' has been renamed as '${newNameRoom}' !!`});
        for (let i = putRooms.length - 1; i >= 0; i--) {
            if (putRooms[i] === room) {
              putRooms[i] = newNameRoom.trim().toLowerCase();
            }
          }
        usersOnServers.forEach((el) => el.room === room ?  el.room = newNameRoom.trim().toLowerCase() : null );
        var usersRoom = [];
        usersOnServers.forEach((el) => el.room === newNameRoom ?  usersRoom.push(el) : null );
        io.to(room).emit('roomData', { room: newNameRoom, users: usersRoom });
        io.to(room).emit('updateRoom', room, newNameRoom);
       
        callback();
    });

    socket.on('renameUser', ({name, newName}, callback) => {
        usernametaken = false;
        usersOnServers.forEach((el) => el.name.trim().toLowerCase() === newName.trim().toLowerCase() ?  usernametaken = true : null );
        if(usernametaken === true)
        {
            return callback('username already taken') 
        }
        usersOnServers.forEach((el) => el.name === name.trim().toLowerCase() ?  el.name = newName.trim().toLowerCase() : null );
        io.emit('message', {user: 'admin', text: `${name} renamed himself to ${newName}`});
        usersOnServers.forEach( (el) => {
            if( el.name === newName )
            {
                usersRoom = [];
                usersOnServers.forEach((elem) => {
                    if(elem.room === el.room)
                    {
                        usersRoom.push(elem)
                    }
                });
                io.to(el.room).emit('roomData', { room: el.room, users: usersRoom})
                io.to(el.room).emit('newName', { oldName: name.trim().toLowerCase(), newName: newName });
            }
        });
        
        callback();
       
    });
    // socket.on('sendRenameMsgAll', (name, newName, callback) => {

    //     io.emit('message', {user: 'admin', text: `${name} renamed himself to ${newName}`});
    //     callback();
       
    // });
    socket.on('deleteChannel', ({room}, callback) => {
        io.emit('message', {user: 'admin', text: `the room '${room}' has been deleted`});
        io.to(room).emit('deleteRoom');

        for (let i = putRooms.length - 1; i >= 0; i--) {
            if (putRooms[i] === room) {
              putRooms.splice(i, 1);
            }
          }
        callback();
       
    });

    socket.on('leaveRoom', (room) => {
        console.log(room)
        socket.leave(room);
    });

    socket.on('joinRoom', (room) => {
        // console.log(room);
        socket.join(room);
       
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
            var usersRoom = [];
            usersOnServers.forEach((el) => el.room === user.room ?  usersRoom.push(el) : null );
            io.to(user.room).emit('roomData', { room: user.room, users: usersRoom });
        }
    });
    
});

app.use(router);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));