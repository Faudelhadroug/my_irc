import React, { useState} from 'react';
import { Link } from 'react-router-dom';

import './Join.css';

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <div>
            <div>
                <h1>Join</h1>
                <div><input placerholder='Name' type='text' onChange={(e) => setName(e.target.value)} /></div>
                <div><input placerholder='Room' type='text' onChange={(e) => setRoom(e.target.value)} /></div>
                <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
                    <button type='submit'>Sign In</button>
                </Link>
            </div>
        </div>
    )
}

export default Join;