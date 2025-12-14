import { useRef, useState } from 'react'
import './App.css'
import ReactMarkdown from 'react-markdown';

interface IMessage {
  message: {
    content: string
  }
  isUser: boolean
}

function Message({ message, isUser }: IMessage) {
  return (
    <div className={`message ${isUser ? 'user' : 'bot'}`}>
      <div id='dsdss'>
        <ReactMarkdown
          children={message.content}
          components={{
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            code({ node, className, children, ...props }) {
              return <code className={className} {...props}>
                {children}
              </code>
            },
          }}
        />
      </div>
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState([
    { id: 1, content: 'Olá! Como posso ajudar?', isUser: false },
  ]);
  const [input, setInput] = useState('');

  const messagesEndRef = useRef(null);

  // useEffect(() => {
  //   messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), content: input, isUser: true };
    setMessages((msgs) => [...msgs, userMsg]);

    const response = await fetch(
      // "http://localhost:5678/webhook-test/88027bb9-d0f2-4242-9eb2-e7933c82bacf",
      "http://localhost:5678/webhook/88027bb9-d0f2-4242-9eb2-e7933c82bacf",
      {
        method: "POST",
        body: JSON.stringify({ message: input }),
      },
    )
    const { output } = await response.json();

    setInput('');

    setMessages((msgs) => [
      ...msgs,
      // { id: Date.now() + 1, content: "output teste", isUser: false },
      { id: Date.now() + 1, content: output, isUser: false },
    ]);
  };

  return (
    <div className="chat-app">
      {/* <Sidebar history={history} onSelect={setSelectedChat} selectedId={selectedChat} /> */}
      <main className="chat-main">
        <div className="messages">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} isUser={msg.isUser} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-bar">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            rows={2}
            onKeyDown={async (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                await handleSend();
              }
            }}
          />
          <button onClick={async () => { await handleSend() }}>Enviar</button>
        </div>
      </main>
    </div>
  );
}

export default App;
