import React, { useState, useEffect, useRef } from 'react';
import { MessageList, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import './App.css';  // 커스텀 스타일을 추가할 수 있는 파일

const App = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [error, setError] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    // WebSocket 연결 설정, useEffect 훅을 사용하여 컴포넌트가 마운트될 때 WebSocket 연결을 설정
    ws.current = new WebSocket('ws://localhost:8080/chat');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      setCurrentMessage(event.data);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket error occurred');
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const handleSendMessage = () => {

    if (ws.current && ws.current.readyState === WebSocket.OPEN) { 
      try{
        const messageObject = { context: currentMessage, roomId : 24071601, userId: 'ysw3114' };  // JSON 형식으로 전송
        ws.current.send(JSON.stringify(messageObject));
        setMessages('');

      } catch (error) {
        console.error('Error stringifying message:', error);
        setError('Error sending message');
      }
      
    }
    else {
      setError('WebSocket is not connected');
    }

    if (currentMessage.trim() !== '') {
      const newMessage = {
        position: 'right',
        type: 'text',
        text: currentMessage,
        date: new Date(),
      };
      setMessages([...messages, newMessage]);
      setCurrentMessage('');
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <MessageList
          className="message-list"
          lockable={true}
          toBottomHeight={'100%'}
          dataSource={messages}
        />
        <div className="input-container">
          <Input
            placeholder="Type a message..."
            multiline={false}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            rightButtons={
              <Button
                text="Send"
                onClick={handleSendMessage}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default App;
