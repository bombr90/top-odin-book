import { mainAPI } from "../apis/mainAPI";
import VoteWidget from "./VoteWidget";
import { timeAgo } from "../util";
import { userContext } from "./userContext";
import { useContext } from "react";
import { ModalContext } from "./ModalContext";
import { useLoading } from "./LoadingContext";
import { BsFillPersonFill } from "react-icons/bs";
import AvatarWidget from "./AvatarWidget";

const PostDetailsWidget = ({ data }) => {
  const { id, content } = data;
  const {
    content: {
      post: { comments },
    },
  } = data;
  const { setModalContent } = useContext(ModalContext);
  const { userData } = useContext(userContext);
  const {setLoading} = useLoading();

  const openCommentModal = async (id) => {
    try {
      setModalContent({
        id: id,
        label: "Comment",
        content: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const postTemplate = ({ id, author, content, likeCount, created }) => {
    const likePost = async (id) => {
      try {
        setLoading(true);
        const result = await mainAPI.likePost({ id: id });
        setLoading(false);
        const { likes, likeCount } = result.postLikes;
        setModalContent((prev) => {
          return {
            ...prev,
            content: {
              ...prev.content,
              post: {
                ...prev.content.post,
                likeCount: likeCount,
                likes: likes,
              },
            },
          };
        });
      } catch (err) {
        console.error(err);
      }
    };
    return (
      <div key={id} className="text-gray-400 bg-white border-b-2">
        <span className="font-bold italic">Original Post:</span>
        <div className="flex p-2">
          <div className="min-w-20 self-center">
            <VoteWidget likeCount={likeCount} onClick={() => likePost(id)} />
          </div>
          <div className="flex flex-col m-1 gap-1 text-left items-start flex-1 justify-center">
            <span className="mt-1 text-xs ">
              {`Posted by ${author.displayName} ${timeAgo(created)} ago`}
            </span>
            <p className="">{content}</p>
          </div>
          <AvatarWidget id={author.id} avatar={author.avatar} size="80px" />
        </div>
      </div>
    );
  };

  const commentTemplate = ({ _id, author, content, created }) => {
    const commentId = _id;
    const deleteComment = async () => {
      try {
        setLoading(true);
        const result = await mainAPI.deleteComment({ id: commentId });
        setLoading(false);
        if (result.deleteCount.deletedCount === 1) {
          alert(`[${result.deleteCount.deletedCount}] comment deleted!`);
          setModalContent((prev) => {
            const newArr = prev.content.post.comments.filter(
              (el) => el._id !== _id
            );
            return {
              ...prev,
              content: {
                ...prev.content,
                post: {
                  ...prev.content.post,
                  comments: newArr,
                },
              },
            };
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <div
        key={commentId}
        className="flex text-gray-400 even:bg-gray-50 odd:bg-slate-100"
      >
        <div className="flex flex-col m-1 gap-1 text-left items-start flex-1 justify-center">
          <span className="mt-1 text-xs ">
            {`Posted by ${author.displayName} ${timeAgo(created)} ago`}
          </span>
          <p className="">{content}</p>
          <span className="flex justify-end w-[100%]">
            {author._id === userData._id ? (
              <button
                onClick={() => deleteComment()}
                className="rounded-sm p-1 text-xs font-bold hover:text-gray-500"
              >
                Delete Comment
              </button>
            ) : (
              ""
            )}
          </span>
        </div>
        <AvatarWidget id={author.id} avatar={author.avatar} size="60px" />
      </div>
    );
  };

  return (
    <div className="flex h-[100%] flex-col">
      <div className="top-0 m-1 sticky">
        {postTemplate(content.post)}
      </div>
      {comments.map((comment) => commentTemplate(comment))}
      <div className="sticky bottom-0 self-end m-1">
        <button
          onClick={() => openCommentModal(id)}
          className="rounded-sm p-1 text-s bg-gray-200 text-gray-400 font-bold hover:text-gray-500"
        >
          Reply to Post
        </button>
      </div>
    </div>
  );
};

export default PostDetailsWidget;
