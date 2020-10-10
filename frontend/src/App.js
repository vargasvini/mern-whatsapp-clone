import React, { useEffect } from 'react';
import './App.css';
import Chat from './components/chat/Chat';
import Sidebar from './components/sidebar/Sidebar';
import Pusher from 'pusher-js';

function App() {
  useEffect(()=>{

  }, []);

  useEffect(()=>{
    const pusher = new Pusher('4af0d494c585654912b2', {
      cluster: 'us2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(data) {
      alert(JSON.stringify(data));
    });

  }, []);

  return (
    <div className="app">
      <div className="app__body"> 
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default App;
