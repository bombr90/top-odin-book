/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
import { mainAPI } from "../apis/mainAPI";
import AvatarWidget from "./AvatarWidget";

const UserCardTemplate = ({ userData, refreshUserIndex, page, limit }) => {
  const { _id, displayName, avatar, isFriend, isRecipient, isRequester } = userData;
    const btn =
    "rounded-md bg-gray-200 px-2 py-1 hover:bg-gray-300 hover:font-bold flex-1";

  async function sendFriendRequest() {
    try {
      console.log('sending...')
      const result = await mainAPI.postFriendRequest({ friendId: _id });
      console.log(result)
      console.log('results from sending friend request',result)
      await refreshUserIndex(page, limit);
    } catch (err) {
      console.error(err);
    }
  }

  async function acceptFriendRequest(bool) {
    try{
      console.log('acceptfriendrequest')
      const result = await mainAPI.putFriendRequest({
        friendId: _id,
        requestStatus: bool,
      });
      await refreshUserIndex(page, limit);
      console.log("accepted request", result);
    } catch(err){
      console.error(err);
    }
  }

  async function deleteFriendRequest() {
    try {
      const result = await mainAPI.deleteFriendRequest({ friendId: _id });
      await refreshUserIndex(page, limit);
      console.log("delete request", result);
    } catch (err) {
      console.error(err);
    }
  }

  async function removeFriend() {
    try {
      const result = await mainAPI.deleteFriend({ friendId: _id });
      await refreshUserIndex(page, limit);
      console.log("remove friend", result);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex p-2 gap-4 even:bg-gray-50 odd:bg-slate-100 text-gray-400 align-items-middle justify-center text-center">
      <AvatarWidget id={_id} avatar={avatar} size="80px"  
      />
      <span className="flex-1 m-auto">{displayName}</span>
      <div className="flex w-[200px] gap-2">
        {isFriend ? (
          <button
            className={btn}
            // data-id={_id}
            onClick={() => removeFriend()}
          >
            Remove Friend
          </button>
        ) : isRecipient ? (
          <div className="flex gap-2">
            <button
              className={btn}
              // data-id={_id}
              onClick={() => acceptFriendRequest(true)}
            >
              Accept Request
            </button>
            <button
              className={btn}
              // data-id={_id}
              onClick={() => acceptFriendRequest(false)}
            >
              Reject Request
            </button>
          </div>
        ) : isRequester ? (
          <button
            className={btn}
            // data-id={_id}
            onClick={() => deleteFriendRequest()}
          >
            Cancel Friend Request
          </button>
        ) : (
          <button
            className={btn}
            // data-id={_id}
            onClick={() => sendFriendRequest()}
          >
            Send Friend Request
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCardTemplate;
