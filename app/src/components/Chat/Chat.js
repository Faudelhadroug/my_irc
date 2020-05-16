import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
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
        console.log(socket);
        console.log(queryString.parse(location.search));
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
        //console.log(chatMessages.scrollTop);
        socket.on('message', (message) => {
            setMessages([...messages, message]);

            console.log(chatMessages);
                if(chatMessages !== null)
                    chatMessages.scrollTop = chatMessages.scrollHeight;
    
                
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
          });
          
    }, [messages]);
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
           <TextContainer users={users}/>
       </div>
    )
}

export default Chat;