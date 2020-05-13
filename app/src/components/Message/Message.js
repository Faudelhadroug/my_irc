import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { user, text }, name}) => {
    let isSentByCurrentUser = false;

    const trimmedName = name.trim().toLowerCase();
    
    if(user === trimmedName){
        isSentByCurrentUser = true;
    }
    return(
        isSentByCurrentUser
        ? (
            <div>
                <p>{trimmedName}</p>
                <div>
                    <p>{ReactEmoji.emojify(text)}</p>
                </div>
            </div>
        )
        : (
            <div>
                <p>{ReactEmoji.emojify(text)}</p>
                <div>
                    <p>{user}</p>
                </div>
            </div>
        )
    )
};

export default Message;