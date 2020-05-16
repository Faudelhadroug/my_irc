import React from 'react';

import './InfoBar.css';

const InfoBar = ({ room }) => (
    <div>
        <div>
            <h3 className='d-flex justify-content-center mt-5'>Actual room: { room }</h3>
        </div>
        <div className='d-flex justify-content-center'>
            <a href='/'>Leave room</a>
        </div>
    </div>
);

export default InfoBar;