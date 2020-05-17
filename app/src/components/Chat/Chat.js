import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import UsersContainer from '../UsersContainer/UsersContainer';
import RoomsContainer from '../RoomsContainer/RoomsContainer';

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
    useEffect(() => {
        const {name, room} = queryString.parse(location.search)

        socket = io(server);

        setName(name);
        setRoom(room);
        socket.emit('join', { name, room }, (error) => {
            if(error) {
                alert(error);
                window.location.replace("/");
            }
        });
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [server, location.search])

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
            if(chatMessages !== null)
                chatMessages.scrollTop = chatMessages.scrollHeight;
        });
        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
        
    }, [messages, chatMessages]);

    useEffect(() => {
        socket.on("rooms", (rooms) => {
            setRooms(rooms)
        });
        // socket.on("rooms", (getRooms) => {
        //     var allRooms = Object.entries(getRooms);
        //     allRooms.forEach(function(room){
        //         if(room[0] === room[0].toLowerCase())
        //         {
        //             memoRooms.push(room[0]);
        //         }          
        //     });
        // });
        console.log('im here ', rooms)
    }, [rooms]);
    
    const sendMessage = (e) => {
        e.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    return (
       <div>
           <div>
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
           </div>
           <UsersContainer users={users}/>
           <RoomsContainer rooms={rooms}/>
       </div>
    )
}

export default Chat;