import React, { useState, useEffect } from 'react';
import { MessageList, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import './App.css';  // 커스텀 스타일을 추가할 수 있는 파일

const App = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  let ws;

  useEffect(() => {
    // WebSocket 연결 설정, useEffect 훅을 사용하여 컴포넌트가 마운트될 때 WebSocket 연결을 설정
    ws = new WebSocket('ws://localhost:8080/ws');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      setCurrentMessage(event.data);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSendMessage = () => {

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(messages);
      setMessages('');
    }

    // fetch('http://localhost:8080/chatroom', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(messages),
    // })
    //   .then(response => response.text())
    //   .then(data => {
    //     // setResponse(data);
    //     setCurrentMessage(''); // 메시지 전송 후 입력 필드를 비웁니다.
    //   })
    //   .catch(error => console.error('Error sending message:', error));


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
