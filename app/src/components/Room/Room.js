import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import './Room.css'

import RoomsContainer from '../RoomsContainer/RoomsContainer';

let socket;

const Room = () => {

    const server = 'localhost:5000';
    socket = io(server);
    const [rooms, setRooms] = useState('');
    useEffect(() => {
        socket.emit('getRooms', () => '');
    }, [server]);

    useEffect(() => {
        socket.on("rooms", (rooms) => {
            setRooms(rooms)
        });
    }, [rooms]);
    
    return(
    <div>
        <RoomsContainer rooms={rooms}/>
    </div>
    )
}

export default Room;