import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import UsersContainer from '../UsersContainer/UsersContainer';
import RoomsContainer from '../RoomsContainer/RoomsContainer';
import ChangeUsername from '../ChangeUsername/ChangeUsername';
import CreateChannel from '../CreateChannel/CreateChannel';

let socket;
const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [rooms, setRooms] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const server = 'localhost:5000';
    const chatMessages = document.querySelector('.chat-messages');
    const [seconds, setSeconds] = useState(0);
    
    if(seconds === 300)
    {
        socket.emit('deleteChannel', { room } , (error) => {
            if(error) {
                alert(error);
            }
        });
    }
    useEffect(() => {
        let interval = null;
        interval = setInterval(() => {
            setSeconds(seconds => seconds + 1);
        }, 1000);
        return () => clearInterval(interval);
      }, [seconds]);
      //console.log(seconds);
    useEffect(() => {
        
        const {name, room} = queryString.parse(location.search)

        socket = io(server, {transports:['websocket']});
        setName(name);
        setRoom(room);
        socket.emit('join', { name, room }, (error) => {
            if(error) {
                alert(error);
                window.location.replace("/");
            }
        });
        
        return () => {
            document.location.reload(true);
            socket.emit('disconnect');
            socket.off();
        }
    }, [server, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
            if(chatMessages !== null)
                chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }, [messages, chatMessages]);

    useEffect(() => {

        socket.on("renameRoom", (renamedRoom, oldRoom) => {
            for (let i = rooms.length - 1; i >= 0; i--) {
                if (rooms[i] === room) {
                    rooms.splice(i, 1);
                    rooms.push(renamedRoom);
                    socket.emit('getRooms', () => '');
                }
                socket.emit('leaveRoom', oldRoom);    
                socket.emit('joinRoom', renamedRoom);
              }
              setRoom(renamedRoom);
            //window.location.replace(`/chat?name=${name}&room=${renamedRoom}`);
        });
    }, [room, rooms]);
   
    useEffect(() => {
        
        //const {name} = queryString.parse(location.search)
        console.log(name);
        socket.on("deleteRoom", () => {
            let url = '/room?name='+name;
            console.log(url);
            socket.emit('leaveRoom', room);
            //document.location.reload(true);
            //window.location = url;
            alert('Room got deleted');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        socket.on("rooms", (rooms) => {
            setRooms(rooms)
        });
    }, [rooms]);

    useEffect(() => {
        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
        socket.on("newName", ( {oldName, newName, room} ) => {
            console.log('newName')
            document.location.reload(true)
            socket.emit('sendRenameRoomAll', oldName, newName, room)
            window.location.replace(`/chat?name=${newName}&room=${room}`); 
            // if (name.trim().toLowerCase() === oldName )
            // {
            //     setName(newName);
            // }
            // console.log(messages);
            // messages.forEach((el, index) => el.user === oldName ? messages.splice(index, 1) : null );
            // socket.emit('sendRenameMsgAll', oldName, newName);
        });
    }, [users, name, messages]);
    
    const sendMessage = (e) => {
        e.preventDefault();

        if(message) {
            setSeconds(0);
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }
    return (
       <div>
           <div>
                <ChangeUsername name={name} room={room} socket={socket} />
                <CreateChannel rooms={room} socket={socket}/>
                <InfoBar room={room} rooms={rooms} users={users} name={name} socket={socket} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
           </div>
           <UsersContainer users={users} /> 
           <RoomsContainer rooms={rooms} />
       </div>
    )
}

export default Chat;