import React from 'react';

import './Input.css';

const Input = ({ message, setMessage, sendMessage }) => (
    <form className='d-flex justify-content-center mb-5'>
        <input 
        className='chat-input'
        type="text"
        placeholder='Write a message..'
        value={message} 
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
/>
        <button onClick={(e) => sendMessage(e)}>Send</button>
    </form>
);

export default Input;