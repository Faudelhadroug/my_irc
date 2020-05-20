import React, { useEffect }from 'react';
import io from 'socket.io-client';

import './InfoBar.css';

let socket;

const InfoBar = ({ room, users, name, server }) => {
    socket = io(server, {transports:['websocket']});

    const deleteRoom = () => {
        socket.emit('deleteChannel', { room } , (error) => {
            if(error) {
                alert(error);
            }
        });
    }
    const changeNameRoom = () => {
       
    }
    var admin = false;
    for (let i = 0; i < users.length; i++) {

        if(users[i].name === name.trim().toLowerCase() && users[i].admin === true)
        {
            admin = true;
        }
    }
    return(
        admin
        ? (
            <div>
            <div>
                <h3 className='d-flex justify-content-center mt-5'>Actual room: { room }</h3>
            </div>
            <div>
                <h4>Settings of the room</h4>
                <div><button onClick={changeNameRoom}>Change name of the room</button></div>
                <div><button onClick={deleteRoom}>Delete</button></div>
            </div>
            <div className='d-flex justify-content-center'>
                <a href='/'>Leave room</a>
            </div>
        </div>
        )
        : (
            <div>
            <div>
                <h3 className='d-flex justify-content-center mt-5'>Actual room: { room }</h3>
            </div>
            <div className='d-flex justify-content-center'>
                <a href='/'>Leave room</a>
            </div>
        </div>
        )

)};

export default InfoBar;