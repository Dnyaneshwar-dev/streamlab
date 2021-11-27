import React, {Component} from 'react';
import {Widget, addResponseMessage, addLinkSnippet, addUserMessage, setQuickButtons} from 'react-chat-widget';

import './chat.css'

import { useEffect } from 'react';

const Chat = () => {
    const handleNewUserMessage = newMessage => {
        console.log(`New message incoming! ${newMessage}`);
        // Now send the message throught the backend API
        addResponseMessage('hi')
    };
    useEffect(() => {
        addResponseMessage('Welcome to this awesome chat!');
    }, [])
    return (
        <div>
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          className="chat-widget"
          title="Chat"
        />
        </div>
    )
}

export default Chat

