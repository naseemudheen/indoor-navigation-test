const TOKEN_KEY = "paatha_token";

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUserPayload = () => {
  const token = getToken();
  if (!token || token === "null" || token === "undefined") {
    return null;
  }
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  const payload = getUserPayload();
  if (!payload) return false;
  
  if (payload.exp) {
    const expirationDate = new Date(payload.exp * 1000);
    if (expirationDate < new Date()) {
      removeToken();
      return false;
    }
  }
  return true;
};

export const isAuthorized = (allowedRoles = []) => {
  if (!isAuthenticated()) return false;
  const payload = getUserPayload();
  if (!payload) return false;
  if (allowedRoles.length === 0) return true;
  return allowedRoles.includes(payload.role);
};
