export const mainAPI = {
  userIndex: async (page, limit) => {
    const response = await fetch(
      `http://localhost:5000/api/v1/user/index?page=${page}&limit=${limit}`,
      {
        method: "get",
        mode: "cors",
        credentials: "include",
      }
    );
    return await response.json();
  },
  postIndex: async (page) => {
    const response = await fetch(
      `http://localhost:5000/api/v1/user/posts/index?page=${page}`,
      {
        method: "get",
        mode: "cors",
        credentials: "include",
      }
    );
    return await response.json();
  },
  postDetails: async (id) => {
    const response = await fetch(
      `http://localhost:5000/api/v1/user/post/${id}`,
      {
        method: "get",
        mode: "cors",
        credentials: "include",
      }
    );
    return await response.json();
  },
  postPost: async (data) => {
    const response = await fetch(`http://localhost:5000/api/v1/user/post`, {
      method: "post",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  postComment: async (data) => {
    const { id } = data;
    const response = await fetch(
      `http://localhost:5000/api/v1/user/post/${id}`,
      {
        method: "post",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await response.json();
  },
  likePost: async (data) => {
    const { id } = data;
    const response = await fetch(
      `http://localhost:5000/api/v1/user/post/${id}/like`,
      {
        method: "put",
        mode: "cors",
        credentials: "include",
      }
    );
    return await response.json();
  },
  deletePost: async (data) => {
    const { id } = data;
    const response = await fetch(
      `http://localhost:5000/api/v1/user/post/${id}`,
      {
        method: "delete",
        mode: "cors",
        credentials: "include",
      }
    );
    return await response.json();
  },
  deleteComment: async (data) => {
    const { id } = data;
    const response = await fetch(
      `http://localhost:5000/api/v1/user/comment/${id}`,
      {
        method: "delete",
        mode: "cors",
        credentials: "include",
      }
    );
    return await response.json();
  },
  postFriendRequest: async (data) => {
    const response = await fetch(
      `http://localhost:5000/api/v1/user/friendsrequest`,
      {
        method: "post",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await response.json();
  },
  deleteFriendRequest: async (data) => {
    const response = await fetch(
      `http://localhost:5000/api/v1/user/friendsrequest`,
      {
        method: "delete",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await response.json();
  },
  putFriendRequest: async (data) => {
    const response = await fetch(
      `http://localhost:5000/api/v1/user/friendsrequest`,
      {
        method: "put",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await response.json();
  },
  // getFriendRequests: async () => {
  //   const response = await fetch(
  //     `http://localhost:5000/api/v1/user/friendsrequest`,
  //     {
  //       method: "get",
  //       mode: "cors",
  //       credentials: "include",
  //     }
  //   );
  //   return await response.json();
  // },
  // getFriendsList: async () => {
  //   const response = await fetch(`http://localhost:5000/api/v1/user/friends`, {
  //     method: "get",
  //     mode: "cors",
  //     credentials: "include",
  //   });
  //   return await response.json();
  // },
  deleteFriend: async (data) => {
    const response = await fetch(`http://localhost:5000/api/v1/user/friends`, {
      method: "delete",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  getUserProfile: async(data)=>{
    const {id} = data
    const response = await fetch(`http://localhost:5000/api/v1/user/${id}/profile`, {
      method: "get",
      mode: "cors",
      credentials: "include",
    });
    return await response.json();
  }
};