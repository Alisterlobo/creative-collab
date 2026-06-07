import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

// const SOCKET_URL = 'http://localhost:5000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const STATUS_COLS = [
  { key: 'todo', label: 'To Do', color: 'text-muted' },
  { key: 'inprogress', label: 'In Progress', color: 'text-orange-500' },
  { key: 'done', label: 'Done ✓', color: 'text-green-600' },
];

export default function CollabRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchRoom();
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('join-room', id);

    socketRef.current.on('receive-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socketRef.current.on('tasks-updated', (updatedTasks) => {
      setTasks(updatedTasks);
    });

    return () => socketRef.current.disconnect();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRoom = async () => {
    try {
      const res = await api.get(`/collabs/${id}`);
      setRoom(res.data);
      setMessages(res.data.messages || []);
      setTasks(res.data.tasks || []);
    } catch {
      toast.error('Failed to load room');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    const msg = {
      sender: { _id: user._id, name: user.name },
      text,
      createdAt: new Date().toISOString(),
    };
    socketRef.current.emit('send-message', { roomId: id, message: msg });
    setMessages(prev => [...prev, msg]);
    setText('');
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await api.post(`/collabs/${id}/tasks`, { title: newTask });
      socketRef.current.emit('task-update', { roomId: id, tasks: res.data });
      setTasks(res.data);
      setNewTask('');
      toast.success('Task added!');
    } catch {
      toast.error('Failed to add task');
    }
  };

  const moveTask = async (taskId, status) => {
    try {
      const res = await api.put(`/collabs/${id}/tasks/${taskId}`, { status });
      socketRef.current.emit('task-update', { roomId: id, tasks: res.data });
      setTasks(res.data);
    } catch {
      toast.error('Failed to update task');
    }
  };

  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-muted font-dm animate-pulse">Loading collab room...</div>
    </div>
  );

  if (!room) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-muted font-dm">Room not found.</div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col border-r border-black/10">
        {/* Room Header */}
        <div className="px-6 py-4 border-b border-black/10 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-syne font-black text-lg text-ink">{room.title}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted font-dm">{room.members?.length} members</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                <span className="text-xs text-green-600 font-dm font-medium">Live</span>
              </div>
            </div>
            <div className="flex -space-x-2">
              {room.members?.slice(0, 4).map((m, i) => (
                <div
                  key={m._id}
                  title={m.name}
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: ['linear-gradient(135deg,#5B3BCC,#9B6EF0)', 'linear-gradient(135deg,#E8531A,#F59E0B)', 'linear-gradient(135deg,#1A6B3A,#4ADE80)', '#333'][i % 4], zIndex: 10 - i }}
                >
                  {getInitials(m.name)}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="flex gap-1 mt-3 md:hidden bg-surface rounded-lg p-1 w-fit">
            {['chat', 'tasks'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-xs font-dm font-medium capitalize transition-all ${
                  activeTab === tab ? 'bg-white text-ink shadow-sm' : 'text-muted'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-4 flex flex-col gap-3 ${activeTab === 'tasks' ? 'hidden md:flex' : ''}`}>
          {messages.length === 0 && (
            <div className="text-center text-muted text-sm font-dm py-10">
              No messages yet. Start the conversation! 👋
            </div>
          )}
          {messages.map((msg, i) => {
            const isMe = msg.sender?._id === user._id || msg.sender === user._id;
            return (
              <div key={i} className={`flex gap-2 items-end ${isMe ? 'justify-end' : ''}`}>
                {!isMe && (
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: 'linear-gradient(135deg,#5B3BCC,#9B6EF0)' }}
                  >
                    {getInitials(msg.sender?.name)}
                  </div>
                )}
                <div className={`max-w-xs ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isMe && (
                    <span className="text-[10px] text-muted font-dm mb-1 ml-1">{msg.sender?.name}</span>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm font-dm ${
                    isMe
                      ? 'bg-ink text-white rounded-br-sm'
                      : 'bg-surface text-ink rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted font-dm mt-1 mx-1">
                    {msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true }) : 'just now'}
                  </span>
                </div>
                {isMe && (
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: 'linear-gradient(135deg,#E8531A,#CC3B9A)' }}
                  >
                    {getInitials(user.name)}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Message Input */}
        <div className={`p-4 border-t border-black/10 bg-white ${activeTab === 'tasks' ? 'hidden md:flex' : 'flex'} gap-2`}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Message the team..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-black/10 bg-surface font-dm text-sm outline-none focus:border-ink transition-colors"
          />
          <button
            onClick={sendMessage}
            className="bg-ink text-white px-5 py-2.5 rounded-xl text-sm font-dm font-semibold hover:opacity-80 transition-opacity"
          >
            Send
          </button>
        </div>
      </div>

      {/* Kanban Panel */}
      <div className={`w-80 flex flex-col bg-cream ${activeTab === 'chat' ? 'hidden md:flex' : ''}`}>
        <div className="px-4 py-4 border-b border-black/10 bg-white">
          <h2 className="font-syne font-bold text-sm text-ink">Task Board</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          {STATUS_COLS.map(col => (
            <div key={col.key} className="bg-surface rounded-xl p-3">
              <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${col.color}`}>
                {col.label}
              </div>
              {tasks.filter(t => t.status === col.key).map(task => (
                <div
                  key={task._id}
                  className="bg-white border border-black/10 rounded-lg p-2.5 mb-2 text-sm font-dm text-ink hover:border-black/30 transition-colors"
                >
                  <div className="mb-2">{task.title}</div>
                  <div className="flex gap-1">
                    {STATUS_COLS.filter(s => s.key !== col.key).map(s => (
                      <button
                        key={s.key}
                        onClick={() => moveTask(task._id, s.key)}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface text-muted hover:bg-ink hover:text-white transition-all"
                      >
                        → {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Add Task */}
        <div className="p-3 border-t border-black/10 bg-white flex gap-2">
          <input
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="Add a task..."
            className="flex-1 px-3 py-2 rounded-lg border border-black/10 bg-surface font-dm text-xs outline-none focus:border-ink transition-colors"
          />
          <button
            onClick={addTask}
            className="bg-ink text-white px-3 py-2 rounded-lg text-xs font-semibold hover:opacity-80 transition-opacity"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}