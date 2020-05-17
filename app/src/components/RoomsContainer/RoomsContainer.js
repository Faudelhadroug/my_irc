import React from 'react';

import './RoomsContainer.css';

 const RoomsContainer = ({rooms}) => {console.log(rooms);
  return (
    <div>
    {
        rooms
          ? (
            <div>
              <h1>Rooms online</h1>
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
          : null
      }
    </div>
  )};


export default RoomsContainer;