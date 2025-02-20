import React, { useState } from 'react';
import queryString from 'query-string';

import './CreateChannel.css';

const CreateChannel = ({rooms, socket}) =>{
    const [newRoom, setNewRoom] = useState('');
    const name = queryString.parse(window.location.search)['name']
    const clickCreate = () => {
        var room = newRoom;
        socket.emit('addChannel', { name, room } , (error) => {
            if(error) {
                alert(error);
                window.location.replace("/");
            }
        });
    }
    return(
        <div>
            <div>
                <h2> Create new room </h2>
                <div className=''> <label className='mr-3' htmlFor="newRoom">New room:</label> <input name="newRoom" type='text' onChange={(e) => setNewRoom(e.target.value)} /> </div>
                <div className=''> <button id='submitRoom' type='submit' onClick={e => (!newRoom || newRoom.includes(rooms) === true) ? e.preventDefault() : clickCreate()}>Create new room</button></div>
            </div>
        </div>
    );
};

export default CreateChannel;