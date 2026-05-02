import React, { useState } from 'react';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TeamWorkspace from './pages/TeamWorkspace';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  if (currentTeam) {
    return (
      <TeamWorkspace 
        user={user} 
        team={currentTeam} 
        onBack={() => setCurrentTeam(null)} 
      />
    );
  }

  return (
    <DashboardPage 
      user={user} 
      onSelectTeam={setCurrentTeam} 
    />
  );
}

export default App;
