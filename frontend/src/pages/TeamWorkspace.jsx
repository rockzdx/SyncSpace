import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function TeamWorkspace({ user, team, onBack }) {
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activity, setActivity] = useState([]);
  
  // Forms
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [storyPoints, setStoryPoints] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [blockedById, setBlockedById] = useState('');
  const [msgContent, setMsgContent] = useState('');
  
  // Filters
  const [myTasksOnly, setMyTasksOnly] = useState(false);

  useEffect(() => {
    loadData();
    // Simple polling for a hackathon demo
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [team.id, myTasksOnly]);

  const loadData = async () => {
    const t = await api.getTasks(team.id, myTasksOnly ? user.id : '');
    setTasks(t);
    const m = await api.getMessages(team.id);
    setMessages(m);
    const a = await api.getActivityLogs(team.id);
    setActivity(a);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    await api.createTask(team.id, user.id, title, desc, priority, storyPoints, dueDate, blockedById);
    setTitle(''); setDesc(''); setStoryPoints(''); setDueDate(''); setBlockedById('');
    loadData();
  };

  const handleStatusChange = async (taskId, status) => {
    await api.updateTaskStatus(taskId, user.id, status);
    loadData();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(!msgContent.trim()) return;
    await api.sendMessage(team.id, user.id, msgContent);
    setMsgContent('');
    loadData();
  };

  const renderColumn = (status, title, colorClass) => (
    <div className={`bauhaus-border p-4 ${colorClass}`} style={{ flex: 1, minWidth: '300px' }}>
      <h2 style={{ borderBottom: '4px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px' }}>{title}</h2>
      <div className="flex-col gap-4">
        {tasks.filter(t => t.status === status).map(t => {
          const blockingTask = tasks.find(tsk => tsk.id === t.blockedById);
          const isBlocked = blockingTask && blockingTask.status !== 'DONE';
          const textColor = status === 'DONE' ? 'white' : (isBlocked ? 'white' : 'black');
          
          return (
          <div key={t.id} className={`card ${status === 'DONE' ? 'bg-green' : (isBlocked ? 'bg-dark' : 'bg-white')}`} style={{ padding: '16px', opacity: isBlocked ? 0.8 : 1 }}>
            <div className="flex justify-between items-start mb-2">
              <h3 style={{ margin: '0', color: textColor }}>
                {isBlocked && '🔒 '} {t.title}
              </h3>
              {t.storyPoints != null && <span className="bg-yellow bauhaus-border-thin" style={{ padding: '2px 6px', fontWeight: 'bold', fontSize: '0.8rem', color: 'black' }}>{t.storyPoints} PTS</span>}
            </div>
            
            <p style={{ fontSize: '0.9rem', marginBottom: '8px', color: textColor }}>{t.description}</p>
            
            <div style={{ fontSize: '0.7rem', marginBottom: '16px', color: status === 'DONE' ? '#EEE' : (isBlocked ? '#CCC' : '#666') }}>
               Created: {new Date(t.createdAt).toLocaleDateString()}
               {t.dueDate && ` | Due: ${new Date(t.dueDate).toLocaleDateString()}`}
            </div>

            <div className="flex justify-between items-center">
              <span style={{ fontWeight: 'bold', fontSize: '0.8rem', backgroundColor: 'black', color: 'white', padding: '4px 8px' }}>
                {t.priority}
              </span>
              <div className="flex gap-2">
                {!isBlocked && status !== 'TODO' && <button className="btn btn-yellow" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleStatusChange(t.id, 'TODO')}>←</button>}
                {!isBlocked && status !== 'IN_PROGRESS' && <button className="btn btn-blue" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleStatusChange(t.id, 'IN_PROGRESS')}>►</button>}
                {!isBlocked && status !== 'DONE' && <button className="btn btn-red" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleStatusChange(t.id, 'DONE')}>✓</button>}
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.8rem', fontWeight: 'bold', color: textColor }}>
              Assignee: {t.assignee?.username || 'Unassigned'}
            </div>
            {isBlocked && (
              <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--primary-yellow)', fontWeight: 'bold' }}>
                BLOCKED BY: {blockingTask.title}
              </div>
            )}
          </div>
        )})}
      </div>
    </div>
  );

  return (
    <main className="flex-col h-screen" role="main">
      {/* Header */}
      <header className="flex justify-between items-center bauhaus-border p-4 bg-dark" style={{ color: 'white' }}>
        <div className="flex items-center gap-4">
          <button className="btn btn-white" onClick={onBack}>← BACK</button>
          <h1 style={{ fontSize: '2rem' }}>{team.name}</h1>
        </div>
        <div className="flex gap-4 items-center">
           <button className={`btn ${myTasksOnly ? 'btn-red' : 'btn-white'}`} onClick={() => setMyTasksOnly(!myTasksOnly)}>
             {myTasksOnly ? 'SHOW ALL TASKS' : 'MY TASKS FILTER'}
           </button>
           <span style={{ fontWeight: 'bold' }}>USER: {user.username}</span>
        </div>
      </header>

      <div className="flex" style={{ flex: 1, overflow: 'hidden' }} role="region" aria-label="Workspace content">
        
        {/* Kanban Board */}
        <div style={{ flex: 3, overflowY: 'auto', padding: '24px' }} className="bg-bg-color">
          
          {/* Create Task Bar */}
          <section className="card bg-yellow flex gap-4 items-center" style={{ marginBottom: '24px' }} aria-labelledby="new-task-heading">
            <h3 id="new-task-heading" style={{ margin: 0 }}>NEW TASK:</h3>
            <form onSubmit={handleCreateTask} className="flex gap-2" style={{ flex: 1, flexWrap: 'wrap' }} aria-label="Create new task form">
              <input className="input" placeholder="TITLE" aria-label="Task Title" value={title} onChange={e => setTitle(e.target.value)} required />
              <input className="input" placeholder="DESCRIPTION" aria-label="Task Description" value={desc} onChange={e => setDesc(e.target.value)} required />
              <input className="input" type="number" placeholder="PTS" aria-label="Story Points" style={{ width: '70px' }} value={storyPoints} onChange={e => setStoryPoints(e.target.value)} />
              <input className="input" type="date" aria-label="Due Date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              <select className="input" aria-label="Task Priority" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
              <select className="input" aria-label="Blocked By" value={blockedById} onChange={e => setBlockedById(e.target.value)}>
                <option value="">NO BLOCKER</option>
                {tasks.filter(t => t.status !== 'DONE').map(t => <option key={t.id} value={t.id}>Blocker: {t.title}</option>)}
              </select>
              <button type="submit" className="btn btn-dark bg-dark">ADD</button>
            </form>
          </section>

          <div className="flex gap-4">
            {renderColumn('TODO', 'TO DO', 'bg-red')}
            {renderColumn('IN_PROGRESS', 'IN PROGRESS', 'bg-yellow')}
            {renderColumn('DONE', 'DONE', 'bg-blue')}
          </div>
        </div>

        {/* Right Sidebar: Chat & Activity */}
        <aside className="flex-col bauhaus-border-thin" style={{ flex: 1, minWidth: '350px', borderTop: 'none', borderBottom: 'none', borderRight: 'none' }} aria-label="Sidebar">
          
          {/* Chat Section */}
          <section className="flex-col" style={{ flex: 1, borderBottom: '4px solid black' }} aria-labelledby="chat-heading">
            <h2 id="chat-heading" className="bg-dark p-4" style={{ color: 'white', margin: 0 }}>TEAM CHAT</h2>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundColor: 'white' }} role="log" aria-label="Chat messages">
              {messages.map(m => (
                <div key={m.id} style={{ marginBottom: '12px' }}>
                  <span style={{ fontWeight: 'bold' }}>{m.sender.username}: </span>
                  <span>{m.content}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex border-thick" style={{ borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }} aria-label="Send chat message form">
              <input className="input" style={{ border: 'none' }} placeholder="TYPE MESSAGE..." aria-label="Chat Message Input" value={msgContent} onChange={e => setMsgContent(e.target.value)} />
              <button type="submit" className="btn bg-dark" style={{ color: 'white', border: 'none', boxShadow: 'none' }}>SEND</button>
            </form>
          </section>

          {/* Activity Log Section */}
          <section className="flex-col bg-yellow" style={{ flex: 1 }} aria-labelledby="activity-heading">
            <h2 id="activity-heading" className="bg-dark p-4" style={{ color: 'white', margin: 0 }}>ACTIVITY LOG</h2>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }} role="log" aria-label="Activity logs">
              {activity.map(a => (
                <div key={a.id} className="bauhaus-border bg-white" style={{ padding: '8px', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{a.user.username}</span> {a.action}
                  <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px' }}>
                    {new Date(a.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </aside>
      </div>
    </main>
  );
}
