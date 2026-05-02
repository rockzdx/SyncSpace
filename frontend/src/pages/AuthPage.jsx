import React, { useState } from 'react';
import { api } from '../services/api';

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let user;
      if (isLogin) {
        user = await api.login(username, password);
      } else {
        user = await api.register(username, password, email);
      }
      onLogin(user);
    } catch (err) {
      setError("Authentication failed. Check credentials.");
    }
  };

  return (
    <main className="flex h-screen w-full" role="main">
      {/* Left side - Graphic */}
      <div className="flex-col justify-center items-center p-8 bg-blue bauhaus-border w-full" style={{ flex: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', width: '300px', height: '300px', backgroundColor: 'var(--primary-red)', borderRadius: '50%', border: '4px solid black', top: '-50px', left: '-50px' }}></div>
        <div style={{ position: 'absolute', width: '200px', height: '200px', backgroundColor: 'var(--primary-yellow)', border: '4px solid black', bottom: '10%', right: '10%', transform: 'rotate(45deg)' }}></div>
        <h1 className="text-massive" style={{ position: 'relative', zIndex: 10, textShadow: '8px 8px 0px var(--border-color)' }}>SYNC<br/>SPACE</h1>
        <p style={{ position: 'relative', zIndex: 10, fontSize: '1.5rem', marginTop: '20px', border: '2px solid black', padding: '10px', backgroundColor: 'white', color: 'black' }}>
          CONSTRUCT YOUR WORKFLOW.
        </p>
      </div>

      {/* Right side - Form */}
      <div className="flex-col justify-center p-8 bg-yellow bauhaus-border" style={{ flex: 1 }}>
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
          <div className="circle-decorator bg-red"></div>
          <div className="square-decorator bg-blue"></div>
          <h2>{isLogin ? 'LOGIN' : 'REGISTER'}</h2>
          
          <form onSubmit={handleSubmit} className="flex-col gap-4" style={{ marginTop: '24px' }} aria-label={isLogin ? 'Login form' : 'Registration form'}>
            {error && <div style={{ backgroundColor: 'black', color: 'white', padding: '8px', fontWeight: 'bold' }} role="alert">{error}</div>}
            
            <input className="input" placeholder="USERNAME" aria-label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            
            {!isLogin && (
              <input className="input" type="email" placeholder="EMAIL" aria-label="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
            )}
            
            <input className="input" type="password" placeholder="PASSWORD" aria-label="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            
            <button type="submit" className="btn btn-red w-full mt-4" style={{ marginTop: '16px' }}>
              {isLogin ? 'ENTER WORKSPACE' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <button onClick={() => setIsLogin(!isLogin)} className="btn btn-white w-full" style={{ marginTop: '16px' }}>
            {isLogin ? 'NEED AN ACCOUNT?' : 'ALREADY HAVE ONE?'}
          </button>
        </div>
      </div>
    </main>
  );
}
