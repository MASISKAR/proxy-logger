import React, {useState, useEffect, Fragment} from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4001', { port: 3000 });

function App() {
  const [logs, setLogs] = useState([]);
  
  const clearLogs = () => {
    socket.emit('clear-logs');
    setLogs([]);
  };
  
  const decorateLog = (log)=>{
    if(!log){
      return '';
    }
    const [message, status] = log.split('->');
    const [, statusCode] = status.split(/Status: (\d{3})/);
    const isSuccessCode = statusCode ? statusCode.startsWith('2') : false;
    return [
      <Fragment key={message}>{message}</Fragment>,
      <span key={status} className={isSuccessCode ? 'successCode' : 'errorCode'}>{status}</span>
    ];
  }
  useEffect(() => {
    socket.emit('receive-all-logs');
    socket.on('log-receive', (log) => {
      setLogs((oldLogs)=> [...new Set([...oldLogs, log])]);
    });
    
    socket.on('all-logs-receive', (logs) => {
      setLogs([...new Set(logs)]);
    });
  }, []);
  
  return (
          <div className='logContainer'>
            <button onClick={clearLogs} className='clear-logs-btn'>Clear logs</button>
            { logs.map((log)=><pre key={log}>
              {decorateLog(log)}
            </pre>)}
          </div>
  );
}

export default App;
