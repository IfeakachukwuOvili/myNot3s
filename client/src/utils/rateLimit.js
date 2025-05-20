const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_ATTEMPTS = 5;

const attempts = new Map();

export const rateLimit = (action) => {
  const now = Date.now();
  const key = `${action}_${now}`;
  
  // Clean up old attempts
  for (const [storedKey, timestamp] of attempts.entries()) {
    if (now - timestamp > RATE_LIMIT_WINDOW) {
      attempts.delete(storedKey);
    }
  }
  
  // Count recent attempts
  const recentAttempts = Array.from(attempts.keys())
    .filter(k => k.startsWith(action))
    .length;
    
  if (recentAttempts >= MAX_ATTEMPTS) {
    return false;
  }
  
  attempts.set(key, now);
  return true;
};