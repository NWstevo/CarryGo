const prefix = "carrygo:";

export const storage = {
  get(key, fallback = null) {
    try {
      const value = window.localStorage.getItem(prefix + key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    window.localStorage.setItem(prefix + key, JSON.stringify(value));
  },

  remove(key) {
    window.localStorage.removeItem(prefix + key);
  },

  clear() {
    Object.keys(window.localStorage).forEach((key) => {
      if (key.startsWith(prefix)) {
        window.localStorage.removeItem(key);
      }
    });
  },
};
