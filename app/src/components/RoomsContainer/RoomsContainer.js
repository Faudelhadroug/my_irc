import React from 'react';

import './RoomsContainer.css';

 const RoomsContainer = ({rooms}) => {
   console.log(rooms)
  return (
    <div>
    {
        rooms.length <= 1
          ? (
            <div>
              <h1>Rooms online</h1>
              <div>
                <h2>
                  {rooms.map((room, i) => (
                    <div key={room + i}>
                      {room}
                    </div>
                  ))}
                </h2>
              </div>
            </div>
          )
          : (
            <div>
              <h1>Rooms online</h1>
              <div>
                <h2>
                  {rooms}
                </h2>
              </div>
            </div>
          )
      }
    </div>
  );
 }


export default RoomsContainer;