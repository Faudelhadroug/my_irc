import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './ChangeUsername.css';


const ChangeUsername = ({ name, room }) => {

    const [newName, setNewName] = useState('');

    return (
        <div>
            <div className='d-flex justify-content-around'>
                <h2 className='p-2 bd-highlight'>Change name ({name})</h2>
                <div className=''><label className='mr-3' htmlFor="newName">New username:</label><input name="newName" type='text' onChange={(e) => setNewName(e.target.value)} /></div>
                <Link onClick={e => (!newName) ? e.preventDefault() : null} to={`/chat?name=${newName}&room=${room}`}>
                   <div className='d-flex justify-content-center mt-3 mr-5'> <button type='submit'>Change username</button></div>
                </Link>
            </div>
        </div>
    );
}
export default ChangeUsername;