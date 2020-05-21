import React, { useState } from 'react';
import io from 'socket.io-client';

import './ChangeUsername.css';

let socket

const ChangeUsername = ({ name, room, server }) => {

    socket = io(server, {transports:['websocket']});
    const [newName, setNewName] = useState('');
    const renameUser = () => {
        socket.emit('renameUser', { room, name, newName } , (error) => {
            if(error) {
                alert(error);
            }
        });
    }

    // to={`/chat?name=${newName}&room=${room}`}

    return (
        <div>
            <div className='d-flex justify-content-around'>
                <h2 className='p-2 bd-highlight'>Change name </h2>
                <div className=''><label className='mr-3' htmlFor="newName">New username:</label><input name="newName" type='text' onChange={(e) => setNewName(e.target.value)} /></div>
                <div className='d-flex justify-content-center mt-3 mr-5'> <button onClick={e => (!newName) ? e.preventDefault() : renameUser() }>Change username</button></div>

            </div>
        </div>
    );
}
export default ChangeUsername;