import React, { useState} from 'react';
import { Link } from 'react-router-dom';

import './Join.css';

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <div>
            <div>
                <h1 className='d-flex justify-content-center'>Join</h1>
                <div className='d-flex justify-content-center'><label className='mr-3' htmlFor="Name">Username:</label><input name="Name" type='text' onChange={(e) => setName(e.target.value)} /></div>
                <div className='d-flex justify-content-center mt-3'><label className='mr-5' htmlFor="Name">Room:</label><input name='Room' type='text' onChange={(e) => setRoom(e.target.value)} /></div>
                <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
                   <div className='d-flex justify-content-center mt-3 mr-5'> <button type='submit'>Sign In</button></div>
                </Link>
            </div>
        </div>
    )
}

export default Join;