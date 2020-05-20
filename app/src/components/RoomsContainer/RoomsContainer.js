import React, {useEffect} from 'react';
import io from 'socket.io-client';

import './RoomsContainer.css';

let socket;

const RoomsContainer = ({ rooms }) => { 

  return (
    <div>
    {
        rooms
          ? (
            <div>
              <h1>Rooms avaible</h1>
              <div>
                <h2>
                {rooms.map((room, i) => (
                    <div key={i*218+room}>
                      {room}
                    </div>
                  ))}
                </h2>
              </div>
            </div>
          )
          : (
            <div>
              <h1>Rooms avaible</h1>
              <div>
                <h2>
                  
                </h2>
              </div>
            </div>
          )
      }
    </div>
  )};


export default RoomsContainer;