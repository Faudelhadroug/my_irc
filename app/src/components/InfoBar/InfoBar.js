import React from 'react';

import './InfoBar.css';

const InfoBar = ({ room }) => (
    <div>
        <div>
            <h3>{ room }</h3>
        </div>
        <div>
            <a href='/'>Close</a>
        </div>
    </div>
);

export default InfoBar;