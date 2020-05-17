import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import './Join.css';
import RoomsContainer from '../RoomsContainer/RoomsContainer';

let socket;

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [rooms, setRooms] = useState('');
    const server = 'localhost:5000';
    useEffect(() => {
        socket = io(server);
        console.log('server');
        socket.emit('getRooms', () => '');
    }, [server]);

    useEffect(() => {
        socket.on("rooms", (rooms) => {
            setRooms(rooms)
            console.log(rooms);
        });
        
        console.log(rooms);
    }, [rooms]);
    
    //socket.emit('getRooms', () => setRooms(''));
    console.log(rooms);
    return (
        <div>
            <div className='mb-5'>
                <h1 className='d-flex justify-content-center'>Join</h1>
                <div className='d-flex justify-content-center'><label className='mr-3' htmlFor="Name">Username:</label><input name="Name" type='text' onChange={(e) => setName(e.target.value)} /></div>
                <div className='d-flex justify-content-center mt-3'><label className='mr-5' htmlFor="Name">Room:</label><input name='Room' type='text' onChange={(e) => setRoom(e.target.value)} /></div>
                <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
                   <div className='d-flex justify-content-center mt-3 mr-5'> <button type='submit'>Sign In</button></div>
                </Link>
            </div>
            <RoomsContainer rooms={rooms}/>
        </div>
       
    )
}

export default Join;