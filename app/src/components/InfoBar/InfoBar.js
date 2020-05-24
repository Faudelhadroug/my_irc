import React, { useState } from 'react';

import './InfoBar.css';

const InfoBar = ({ usersOnServer, room, rooms, users, name, socket }) => {
    const [newNameRoom, setNewNameRoom] = useState('');
    const deleteRoom = () => {
        socket.emit('deleteChannel', { room } , (error) => {
            if(error) {
                alert(error);
            }
        });
    }
    const changeNameRoom = () => {

        if(newNameRoom === '')
        {
            alert('can\'t be avoid')
        }
        else
        {
            if(rooms.indexOf(newNameRoom) !== -1)
            {
                alert('this room already exist !')
            }
            else
            {
                socket.emit('renameChannel', { room, newNameRoom } , (error) => {
                    if(error) {
                        alert(error);
                    }
                });
                setNewNameRoom('');
                /* eslint-disable */
                var inputRenameRoom = document.getElementById('renameRoomInput').value='';
                /* eslint-enable */
            }
            
        }

    }

    var admin = false;
    for (let i = 0; i < users.length; i++) {

        if(users[i].name === name.trim().toLowerCase() && users[i].admin === true)
        {
            admin = true;
        }
    }
//<h3 className='d-flex justify-content-center mt-5'>Others room: { usersOnServer.forEach((el) => el.name.trim().toLowerCase() === name.trim().toLowerCase() && el.room.trim().toLowerCase() !== room.trim().toLowerCase() ?el.room : console.log(name, ' -- ', room, ' ---- ',el.room) )}</h3>
    return(
        admin
        ? (
            <div>
            <div>
                <h3 className='d-flex justify-content-center mt-5'>Actual room: { room }</h3>
                
            </div>
            <div>
                <h4>Settings of the room</h4>
                <div><label className='mr-3' htmlFor="NewNameRoom">Rename room:</label><input name="NewNameRoom" id='renameRoomInput' type='text' onChange={(e) => setNewNameRoom(e.target.value)} /><button onClick={changeNameRoom}>Change name of the room</button></div>
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