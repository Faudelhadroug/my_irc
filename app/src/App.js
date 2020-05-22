import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';
import Room from './components/Room/Room';

const App = () => (
    <Router>
        <Route path="/" exact component={Join} />
        <Route path="/chat" exact component={Chat} />
        <Route path="/room" exact component={Room} />
    </Router>
)

export default App;