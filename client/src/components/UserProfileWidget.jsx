import { mainAPI } from "../apis/mainAPI";
import { timeAgo } from "../util";
import { BsFillPersonFill, BsFillHandThumbsUpFill } from "react-icons/bs";
import { ModalContext } from "./ModalContext";
import { useLoading } from "./LoadingContext";
import { useContext, useState } from "react";
import { userContext } from "./userContext";
import { authAPI } from "../apis/authAPI";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const UserProfileWidget = ({ data }) => {
  const { id, displayName, avatar, created, updated, firstName, lastName, posts=[] } = data.content;
  const { setModalContent, modalContent } = useContext(ModalContext);
  const { setLoading } = useLoading();
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { userData, setUserData } = useContext(userContext);
  const navigate=useNavigate();
  const dateCreated = new Date(created).toLocaleDateString();
  const deleteUser = async () => {
      try { 
        setLoading(true);
        await authAPI.deleteUser();
        setLoading(false);
        setUserData(null);
        alert('You have deleted your account.')
        setModalContent({
          ...modalContent,
          label: "Login",
          credentials: {
            email: "",
            password: "",
          },
        });
        navigate("/auth/v1/login")
      } catch (err) {
        console.error(err);
      }
    };

  const postTemplate = ({ id, content, likeCount, created }) => {
    const getPostDetails = async (id) => {
      try {
        setLoading(true);
        const result = await mainAPI.postDetails(id);
        setLoading(false);
        const { data } = result;
        setModalContent({
          id: id,
          label: "PostDetails",
          content: data,
        });
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <div
        key={id}
        className="flex text-gray-400 odd:bg-gray-50 even:bg-slate-100 even:hover:bg-slate-50 odd:hover:bg-gray-100 p-1"
      >
        <button 
          className="flex flex-1" 
          onClick={() => getPostDetails(id)}
        >
          <div className="min-w-20 self-center">
            <div
              className={`flex items-center justify-center gap-1 text-blue-500`}
            >
              <BsFillHandThumbsUpFill className="p-1 fill-blue-500" size={30} />
              {likeCount}
            </div>
          </div>
          <div className="flex flex-col m-1 gap-1 text-left items-start flex-1 justify-center">
            <span className="mt-1 text-xs ">
              {`Posted ${timeAgo(created)} ago`}
            </span>
            <p className="">{content}</p>
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-1 h-[100%] gap-2 flex-col text-gray-500 bg-gray-300 p-2 ">
      <div className="flex mx-auto gap-6 font-bold text-l">
        {avatar === "" ? (
          <div className="text-blue-800 self-center flex bg-gray-200 p-1 items-center aspect-square rounded-full m-2">
            <BsFillPersonFill size="4rem" color="inherit" />
          </div>
        ) : (
          <div className="flex w-[80px] h-[80px] p-1 bg-gray-200 rounded-full m-2 self-center">
            <img
              src={avatar}
              referrerPolicy="no-referrer"
              alt=""
              className="rounded-full"
            ></img>
          </div>
        )}
        <span className="m-auto">{displayName}&apos;s Profile</span>
      </div>
      <ul>
        <li>Member Since: {dateCreated}</li>
        <li>Last Active: {timeAgo(updated)} ago</li>
        <li>First Name: {firstName || "Not disclosed"}</li>
        <li>Last Name: {lastName || "Not disclosed"}</li>
      </ul>
      {posts.length > 0 ? (
        <>
          <span className="text-center font-bold">
            {displayName}&apos;s Posts
          </span>
          <div>{posts.map((post) => postTemplate(post))}</div>
        </>
      ) : (
        ""
      )}
      {userData._id === id ? (
        <div className="flex text-xs font-bold gap-2 self-end">
          <input
            className="hover:fill-white"
            type="checkbox"
            checked={isConfirmed}
            onChange={() => setIsConfirmed(!isConfirmed)}
            id="confirmBox"
          ></input>
          <button
            disabled={!isConfirmed}
            onClick={() => deleteUser()}
            className="rounded-sm p-1 hover:text-gray-500 hover:bg-gray-200 disabled:cursor-not-allowed"
          >
            Delete Account
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

UserProfileWidget.propTypes = {
  data: PropTypes.object.isRequired,
  id: PropTypes.string,
  displayName: PropTypes.string,
  avatar: PropTypes.string,
  created: PropTypes.string,
  updated: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  posts: PropTypes.array,
};

export default UserProfileWidget;
