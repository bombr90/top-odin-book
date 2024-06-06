import { mainAPI } from "../apis/mainAPI";
import VoteWidget from "./VoteWidget";
import { timeAgo } from "../util";
import { userContext } from "./userContext";
import { useContext } from "react";
import { ModalContext } from "./ModalContext";
import { useLoading } from "./LoadingContext";
import AvatarWidget from "./AvatarWidget";
import PaginationWidget from "./PaginationWidget";
import PropTypes from "prop-types";
const UserFeedWidget = ({data}) => {
  const {
    content: { posts, limit, page, maxPage},
  } = data;
  const { modalContent, setModalContent } = useContext(ModalContext);
  const { userData } = useContext(userContext);
  const { setLoading } = useLoading();

 const refreshPostIndex = async (page, limit) => {
   try {
     setLoading(true);
     const result = await mainAPI.postIndex(page, limit);
     setLoading(false);
     const { data } = result;
     setModalContent({
       ...modalContent,
       content: data,
     });
   } catch (err) {
     console.error(err);
   }
 };


  const postTemplate = ({ id, author, content, commentCount, likeCount, created }) => {
    
    const likePost = async (id) => {
      try {
        setLoading(true);
        const result = await mainAPI.likePost({ id: id });
        setLoading(false);

        const { likes, likeCount } = result.postLikes;
        setModalContent((prev) => {
          let newArr = prev.content.posts.map((el) => {
            if (el.id === id) {
              return {
                ...el,
                likeCount: likeCount,
                likes: likes,
              };
            }
            return el;
          });

          return {
            ...prev,
            content: {
              ...prev.content,
              posts: newArr,
            },
          };
        });
      } catch (err) {
        console.error(err);
      }
    };
    
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

    const deletePost = async (id) => {
      try {
        setLoading(true);
        const result = await mainAPI.deletePost({ id: id });
        setLoading(false);
        if(result.deletePostCount.deletedCount === 1){
          alert(
            `[${result.deletePostCount.deletedCount}] Post and [${result.deleteCommentCount.deletedCount}] associated comments Deleted!`
          );
          setModalContent((prev) => {
            const newArr = prev.content.posts.filter((el) => el.id !== id);
            return {
              ...prev,
              content: {
                ...prev.content,
                posts: newArr,
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
        key={id}
        className="flex even:bg-gray-50 odd:bg-slate-100 text-gray-400"
      >
        <div className="min-w-20 self-center">
          <VoteWidget likeCount={likeCount} onClick={() => likePost(id)} />
        </div>
        <div className="flex flex-col m-1 gap-1 text-left items-start flex-1 justify-center">
          <span className="mt-1 text-xs ">
            {`Posted by ${author.displayName} ${timeAgo(created)} ago`}
          </span>
          <p className="">{content}</p>
          <span className="flex justify-between w-[100%]">
            <button
              onClick={() => getPostDetails(id)}
              className="rounded-sm p-1 text-xs font-bold hover:text-gray-500"
            >
              {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
            </button>
            {author._id === userData._id ? (
              <button
                onClick={() => deletePost(id)}
                className="rounded-sm p-1 text-xs font-bold hover:text-gray-500"
              >
                Delete Post
              </button>
            ) : (
              ""
            )}
          </span>
        </div>
        <AvatarWidget id={author.id} avatar={author.avatar} size="80px" />
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col">
      {posts.map((post) => postTemplate(post))}
      <PaginationWidget
        refresh={refreshPostIndex}
        page={page}
        limit={limit}
        maxPage={maxPage}
      />
    </div>
  );
};

UserFeedWidget.propTypes = {
  data: PropTypes.object.isRequired,
};

export default UserFeedWidget;
