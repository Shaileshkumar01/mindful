
import { StressorType } from '../types.js';

/**
 * NOTE: In a production environment, this file would import `firebase/auth` and `firebase/firestore`.
 * Since we do not have valid Firebase API keys for this generation, we are using a 
 * "Local Storage" mock implementation that perfectly mimics the behavior of the requested MVP.
 */

const STORAGE_KEY_USER = 'mindful_user';
const STORAGE_KEY_DATA = 'mindful_data';

// --- Auth Services ---

export const mockSignIn = async (email, pass) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = { uid: 'user-12345', email, displayName: email.split('@')[0] };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      resolve(user);
    }, 800);
  });
};

export const mockSignUp = async (email, pass) => {
  return mockSignIn(email, pass);
};

export const mockSignOut = async () => {
  localStorage.removeItem(STORAGE_KEY_USER);
  return Promise.resolve();
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem(STORAGE_KEY_USER);
  return stored ? JSON.parse(stored) : null;
};

// --- Firestore Services (Mock) ---

export const saveCheckIn = async (checkIn) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allData = JSON.parse(localStorage.getItem(STORAGE_KEY_DATA) || '[]');
      const newEntry = {
        ...checkIn,
        id: Math.random().toString(36).substr(2, 9),
      };
      allData.push(newEntry);
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(allData));
      resolve(newEntry);
    }, 500);
  });
};

export const getHistory = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allData = JSON.parse(localStorage.getItem(STORAGE_KEY_DATA) || '[]');
      // Filter by user and sort by timestamp descending
      const userHistory = allData
        .filter(item => item.userId === userId)
        .sort((a, b) => b.timestamp - a.timestamp);
      
      resolve(userHistory);
    }, 600);
  });
};

// Helper to seed some data for visualization if empty
export const seedInitialData = (userId) => {
  const currentData = JSON.parse(localStorage.getItem(STORAGE_KEY_DATA) || '[]');
  if (currentData.length > 0) return;

  const sampleData = [
    { id: '1', userId, mood: 2, stressor: StressorType.EXAMS, note: 'Bio finals are killing me.', timestamp: Date.now() - 86400000 * 4 },
    { id: '2', userId, mood: 4, stressor: StressorType.RELATIONSHIPS, note: 'Lunch with Sarah was nice.', timestamp: Date.now() - 86400000 * 3 },
    { id: '3', userId, mood: 3, stressor: StressorType.ASSIGNMENTS, note: 'Essay due tomorrow.', timestamp: Date.now() - 86400000 * 2 },
    { id: '4', userId, mood: 1, stressor: StressorType.MONEY, note: 'Rent is due.', timestamp: Date.now() - 86400000 * 1 },
  ];
  localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(sampleData));
};
