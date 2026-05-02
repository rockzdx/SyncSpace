import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function DashboardPage({ user, onSelectTeam }) {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [joinId, setJoinId] = useState('');

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    const data = await api.getTeams(user.id);
    setTeams(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.createTeam(name, desc, user.id);
    setName(''); setDesc('');
    loadTeams();
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    await api.joinTeam(joinId, user.id);
    setJoinId('');
    loadTeams();
  };

  return (
    <main className="p-8" style={{ minHeight: '100vh', paddingBottom: '100px' }} role="main">
      <header className="flex justify-between items-center bauhaus-border p-4 bg-dark" style={{ marginBottom: '32px' }}>
        <h2 style={{ color: 'white' }}>WORKSPACE OVERVIEW</h2>
        <div className="bg-yellow bauhaus-border-thin p-2" style={{ fontWeight: 'bold' }}>USER: {user.username}</div>
      </header>

      <div className="flex gap-8">
        <div style={{ flex: 2 }}>
          <h1 className="text-large" style={{ marginBottom: '24px' }}>YOUR TEAMS</h1>
          <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
            {teams.length === 0 && <p className="bg-white p-4 bauhaus-border">No teams yet. Create or join one.</p>}
            {teams.map(t => (
              <div key={t.id} className="card bg-yellow" style={{ width: '300px', cursor: 'pointer' }} onClick={() => onSelectTeam(t)}>
                <div className="circle-decorator bg-red"></div>
                <h2>{t.name}</h2>
                <div style={{ fontSize: '0.8rem', marginBottom: '8px', fontWeight: 'bold', color: 'var(--primary-red)' }}>TEAM ID: {t.id}</div>
                <p style={{ margin: '16px 0' }}>{t.description}</p>
                <div style={{ borderTop: '4px solid black', paddingTop: '16px', fontWeight: 'bold' }}>
                  MEMBERS: {t.members?.length || 0}
                </div>
                <button className="btn btn-blue w-full" style={{ marginTop: '16px' }}>OPEN BOARD</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <section className="card bg-red" style={{ color: 'white' }} aria-labelledby="create-team-heading">
            <h2 id="create-team-heading" style={{ color: 'white', marginBottom: '16px' }}>CREATE TEAM</h2>
            <form onSubmit={handleCreate} className="flex-col gap-4" aria-label="Create new team form">
              <input className="input" placeholder="TEAM NAME" aria-label="Team Name" value={name} onChange={e => setName(e.target.value)} required />
              <input className="input" placeholder="DESCRIPTION" aria-label="Team Description" value={desc} onChange={e => setDesc(e.target.value)} required />
              <button type="submit" className="btn btn-yellow w-full">CREATE</button>
            </form>
          </section>

          <section className="card bg-blue" style={{ color: 'white' }} aria-labelledby="join-team-heading">
            <h2 id="join-team-heading" style={{ color: 'white', marginBottom: '16px' }}>JOIN TEAM</h2>
            <form onSubmit={handleJoin} className="flex-col gap-4" aria-label="Join team form">
              <input className="input" placeholder="TEAM ID (e.g. 1)" aria-label="Team ID" value={joinId} onChange={e => setJoinId(e.target.value)} required />
              <button type="submit" className="btn btn-white w-full">JOIN</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
