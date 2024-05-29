export const authAPI = {
  loginLocal: async (credentials) => {
    const response = await fetch("http://localhost:5000/auth/v1/login/local", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    return await response.json();
  },
  logout: async () => {
    const response = await fetch("http://localhost:5000/auth/v1/logout", {
      method: "post",
      mode: "cors",
      credentials: "include",
    });
    return await response.json();
  },
  checkUser: async () => {
    const response = await fetch(`http://localhost:5000/api/v1/user/data`, {
      method: "get",
      mode: "cors",
      credentials: "include",
    });
    return await response.json();
  },
  registerUser: async (userProfile) => {
    const response = await fetch(`http://localhost:5000/auth/v1/user/local`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userProfile),
      credentials: "include",
    });
    return await response.json();
  },
  deleteUser: async () => {
    const response = await fetch(`http://localhost:5000/auth/v1/user`, {
      method: "delete",
      mode: "cors",
      credentials: "include",
    });
    return await response.json();
  },

};
