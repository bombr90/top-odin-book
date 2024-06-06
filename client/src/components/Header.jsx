import { useContext } from "react";
import { userContext } from "./userContext";
import { ModalContext } from "./ModalContext";
import { mainAPI } from "../apis/mainAPI";
import { authAPI } from "../apis/authAPI";
import { useLoading } from "./LoadingContext";
import AvatarWidget from "./AvatarWidget";

const Header = () => {
  const { setLoading } = useLoading();
  const { userData, setUserData } = useContext(userContext);
  const { isOpen, setIsOpen, modalContent, setModalContent } =
    useContext(ModalContext);
  const btnStyle = "flex items-center flex-1 text-sm px-6 hover:bg-blue-900";
  const getUserIndex = async () => {
    try {
      setLoading(true);
      const result = await mainAPI.userIndex(0, 10);
      setLoading(false);
      const { data } = result;
      setIsOpen(!isOpen);
      setModalContent({
        ...modalContent,
        label: "UserIndex",
        content: data,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const {user} = await authAPI.logout();
      setLoading(false);
      if(!user){
      setUserData(null);
      }
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
  };

  const getUserFeed = async () => {
    try {
      setLoading(true);
      const result = await mainAPI.postIndex(0,10);
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
  };

  return (
    <div
      id="header"
      className="sticky top-0 flex justify-between bg-blue-800 font-bold flex-col"
    >
      <div className="flex flex-1 m-2 gap-2 ">
        <span className="overflow-hidden h-full px-6 py-1 flex self-center">
          odinbook
        </span>
        <input
          className="flex-1 px-6 py-1 text-white bg-slate-200 disabled:cursor-not-allowed focus:bg-slate-300"
          placeholder="Search odinbook"
          disabled={true}
        ></input>
      </div>
      <div className="flex">
        <span className="flex flex-1">
          {userData !== null ? (
            <button
              onClick={() => logout()}
              className="py-1 px-2 flex-1 text-white-100 overflow-hidden hover:bg-blue-900 text-sm"
            >
              {userData.displayName} Logout
            </button>
          ) : (
            ""
          )}
          <div className="p-1 flex-1">
            <AvatarWidget
              id={userData !== null ? userData._id : ""}
              avatar={userData !== null ? userData.avatar : ""}
              size="80px"
              disabled={!userData && true}
            />
          </div>
        </span>
        <span className="flex flex-1">
          <button className={btnStyle} onClick={() => getUserFeed()}>
            My Feed
          </button>
          <button className={btnStyle} onClick={() => getUserIndex()}>
            Find Friends
          </button>
          <button className={btnStyle} onClick={() => newPost()}>
            New Post
          </button>
        </span>
      </div>
    </div>
  );
};

export default Header;
