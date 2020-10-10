import React, { useEffect, useState } from 'react';
import './App.css';
import Chat from './components/chat/Chat';
import Sidebar from './components/sidebar/Sidebar';
import Pusher from 'pusher-js';
import axios from './axios'

function App() {
  const [messages, setMessages] = useState([]);
  useEffect(()=>{
    axios.get('/api/messages/sync')
    .then(response => {
      setMessages(response.data)
    });
  }, []);

  useEffect(()=>{
    const pusher = new Pusher('4af0d494c585654912b2', {
      cluster: 'us2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      setMessages([...messages, newMessage]);
    });

    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages]);

  console.log(messages)
  
  return (
    <div className="app">
      <div className="app__body"> 
        <Sidebar />
        <Chat messages = {messages} />
      </div>
    </div>
  );
}

export default App;
