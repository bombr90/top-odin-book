import { mainAPI } from "../apis/mainAPI";
import { timeAgo } from "../util";
import { BsFillPersonFill, BsFillHandThumbsUpFill } from "react-icons/bs";
import { ModalContext } from "./ModalContext";
import { useLoading } from "./LoadingContext";
import { useContext } from "react";

const UserProfileWidget = ({ data }) => {
  const { id, displayName, avatar, created, updated, firstName, lastName, posts } = data.content;
  const { setModalContent } = useContext(ModalContext);
  const { setLoading } = useLoading();

  const dateCreated = new Date(created).toLocaleDateString();
  
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
    <div className="flex h-[100%] gap-2 flex-col text-gray-500 bg-gray-300 p-2 ">
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
        <span className="m-auto">{displayName}'s Profile</span>
      </div>
      <ul>
        <li>Member Since: {dateCreated}</li>
        <li>Last Active: {timeAgo(updated)} ago</li>
        <li>First Name: {firstName || "Not disclosed"}</li>
        <li>Last Name: {lastName || "Not disclosed"}</li>
      </ul>
      <span className="text-center font-bold">{displayName}'s Posts</span>
      <div>{posts.map((post) => postTemplate(post))}</div>
    </div>
  );
};

export default UserProfileWidget;
