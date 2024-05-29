import { useContext, useEffect, useState } from "react";
import { userContext } from "./userContext";
import { ModalContext } from "./ModalContext";
import { BsFillPersonFill } from "react-icons/bs";
import { mainAPI } from "../apis/mainAPI";
import { authAPI } from "../apis/authAPI";
import { useLoading } from "./LoadingContext";
import AvatarWidget from "./AvatarWidget";
const Header = () => {
  const {setLoading} = useLoading();
  const { userData, setUserData } = useContext(userContext);
  const { isOpen, setIsOpen, modalContent, setModalContent } = useContext(ModalContext);
  const btnStyle = "flex items-center h-full px-6 hover:bg-blue-900"; 
  
  const getUserIndex = async () => {
    try {
      setLoading(true)
      const result = await mainAPI.userIndex(0, 10);
      setLoading(false);
      const {data} = result
      setIsOpen(!isOpen);
      setModalContent({
        ...modalContent,
        label: "UserIndex", 
        content: data 
      });
    } catch (err) {
      console.error(err);
    }
  };

  const loginLocal = async () => {
    try {
      const credentials = {
        email: "guest@user.com",
        password: "password",
      };
      setLoading(true);
      const result = await authAPI.loginLocal(credentials);
      const { user } =
        result.user !== undefined ? await authAPI.checkUser() : null;
      setLoading(false);
        setUserData(user);
    } catch (err) {
      console.error(err);
    }
  };


  const logout = async () => {
    try {
      setLoading(true);
      const result = await authAPI.logout();
      setLoading(false);
      setUserData(null);
    } catch (err) {
      console.error(err);
    }
  };

  const newPost = async () => {
    setIsOpen(true);
    setModalContent({
      ...modalContent,
      label: "Post",
      content: "",
    });
  }

  const loginPopup = async () => {
    setIsOpen(true);
    setModalContent({
      ...modalContent,
      label: "Login",
      credentials: {
        email: "",
        password: "",
      },
    });
  };

  const registerPopup = async () => {
    setIsOpen(true);
    setModalContent({
      ...modalContent,
      label: "Register",
      userProfile: {
        displayName: "Test User",
        email: "test@user.com",
        firstName: "Test",
        lastName: "User",
        avatar: "",
        password: "password",
      },
    });
  };

  const getUserFeed = async (page) => {
    try {
      setLoading(true);
      const result = await mainAPI.postIndex(page);
      setLoading(false);
      const { data } = result;
      setIsOpen(!isOpen);
      setModalContent({
        ...modalContent,
        label: "UserFeed",
        content: data,
      });
    } catch (err) {
      console.error(err);
    }
  }

  const userProfilePopup = async () => {
    try {
      setLoading(true);
      const result = await mainAPI.getUserProfile({id: userData._id});
      setLoading(false);
      const { data } = result;
      console.log(data)
      setIsOpen(!isOpen);
      setModalContent({
        ...modalContent,
        label: "UserProfile",
        content: data,
      });
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div
      id="header"
      className="sticky top-0 flex h-16 items-center justify-between gap-4 bg-blue-800 font-bold"
    >
      <div className="overflow-hidden h-full px-6 py-2 flex items-center">
        <span>odinbook</span>
      </div>
      <input
        className="flex-1 px-6 py-2 text-white bg-slate-200 disabled:cursor-not-allowed focus:bg-slate-300"
        placeholder="Search odinbook"
        disabled={true}
      ></input>
      <span className="flex h-full">
        <button
          onClick={userData === null ? () => loginLocal() : () => logout()}
          className="overflow-auto py-2 px-6 text-white-100 h-full overflow-hidden flex items-center hover:bg-blue-900"
        >
          {userData === null ? `Login` : `${userData.displayName} Logout`}
        </button>
        <AvatarWidget
          id={userData !== null ? userData._id : ""}
          avatar={userData !== null ? userData.avatar : ""}
          size="60px"
        />
        <button className={btnStyle} onClick={() => getUserFeed()}>
          My Feed
        </button>
        <button className={btnStyle} onClick={() => getUserIndex()}>
          Find Friends
        </button>
        <button className={btnStyle} onClick={() => newPost()}>
          New Post
        </button>
        <button className={btnStyle} onClick={() => loginPopup()}>
          Login Popup
        </button>
        <button className={btnStyle} onClick={() => registerPopup()}>
          Register Popup
        </button>
        <button className={btnStyle} onClick={() => userProfilePopup()}>
          User Profile Popup
        </button>
      </span>
    </div>
  );
};

export default Header;
