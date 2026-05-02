const API_BASE = '/api';

export const api = {
  // Auth
  register: async (username, password, email) => {
    const res = await fetch(`${API_BASE}/auth/register?username=${username}&password=${password}&email=${email}`, { method: 'POST' });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  },
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login?username=${username}&password=${password}`, { method: 'POST' });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  // Teams
  getTeams: async (userId) => {
    const res = await fetch(`${API_BASE}/teams?userId=${userId}`);
    return res.json();
  },
  createTeam: async (name, desc, creatorId) => {
    const res = await fetch(`${API_BASE}/teams?name=${name}&description=${desc}&creatorId=${creatorId}`, { method: 'POST' });
    return res.json();
  },
  joinTeam: async (teamId, userId) => {
    const res = await fetch(`${API_BASE}/teams/${teamId}/join?userId=${userId}`, { method: 'POST' });
    return res.json();
  },

  // Tasks
  getTasks: async (teamId, assigneeId = '') => {
    const url = `${API_BASE}/teams/${teamId}/tasks` + (assigneeId ? `?assigneeId=${assigneeId}` : '');
    const res = await fetch(url);
    return res.json();
  },
  createTask: async (teamId, creatorId, title, desc, priority, storyPoints, dueDate, blockedById) => {
    let url = `${API_BASE}/teams/${teamId}/tasks?creatorId=${creatorId}&title=${title}&description=${desc}&priority=${priority}`;
    if (storyPoints) url += `&storyPoints=${storyPoints}`;
    if (dueDate) url += `&dueDate=${dueDate}`;
    if (blockedById) url += `&blockedById=${blockedById}`;
    
    const res = await fetch(url, { method: 'POST' });
    return res.json();
  },
  updateTaskStatus: async (taskId, userId, status) => {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/status?userId=${userId}&status=${status}`, { method: 'PUT' });
    return res.json();
  },

  // Chat & Activity
  getMessages: async (teamId) => {
    const res = await fetch(`${API_BASE}/teams/${teamId}/messages`);
    return res.json();
  },
  sendMessage: async (teamId, senderId, content) => {
    const res = await fetch(`${API_BASE}/teams/${teamId}/messages?senderId=${senderId}&content=${content}`, { method: 'POST' });
    return res.json();
  },
  getActivityLogs: async (teamId) => {
    const res = await fetch(`${API_BASE}/teams/${teamId}/activity`);
    return res.json();
  }
};
