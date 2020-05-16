import React from 'react';

import './UsersContainer.css';

const UsersContainer = ({users}) => (
    <div>
    {
        users
          ? (
            <div>
              <h1>People currently chatting:</h1>
              <div>
                <h2>
                  {users.map(({name}) => (
                    <div key={name}>
                      {name}
                    </div>
                  ))}
                </h2>
              </div>
            </div>
          )
          : null
      }
    </div>
);

export default UsersContainer;