import { mainAPI } from "../apis/mainAPI";
import AvatarWidget from "./AvatarWidget";
import PropTypes from "prop-types";

const UserCardTemplate = ({ userData, refreshUserIndex, page, limit }) => {
  const { _id, displayName, avatar, isFriend, isRecipient, isRequester } = userData;
    const btn =
    "rounded-md bg-gray-200 px-2 py-1 hover:bg-gray-300 hover:font-bold flex-1";

  async function sendFriendRequest() {
    try {
      await mainAPI.postFriendRequest({ friendId: _id });
      await refreshUserIndex(page, limit);
    } catch (err) {
      console.error(err);
    }
  }

  async function updateFriendRequest(bool) {
    try{
      await mainAPI.putFriendRequest({
        friendId: _id,
        requestStatus: bool,
      });
      await refreshUserIndex(page, limit);
    } catch(err){
      console.error(err);
    }
  }

  async function deleteFriendRequest() {
    try {
      await mainAPI.deleteFriendRequest({ friendId: _id });
      await refreshUserIndex(page, limit);
    } catch (err) {
      console.error(err);
    }
  }

  async function removeFriend() {
    try {
      await mainAPI.deleteFriend({ friendId: _id });
      await refreshUserIndex(page, limit);
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
            onClick={() => removeFriend()}
          >
            Remove Friend
          </button>
        ) : isRecipient ? (
          <div className="flex gap-2">
            <button
              className={btn}
              onClick={() => updateFriendRequest(true)}
            >
              Accept Request
            </button>
            <button
              className={btn}
              onClick={() => updateFriendRequest(false)}
            >
              Reject Request
            </button>
          </div>
        ) : isRequester ? (
          <button
            className={btn}
            onClick={() => deleteFriendRequest()}
          >
            Cancel Friend Request
          </button>
        ) : (
          <button
            className={btn}
            onClick={() => sendFriendRequest()}
          >
            Send Friend Request
          </button>
        )}
      </div>
    </div>
  );
};

UserCardTemplate.propTypes = {
  userData: PropTypes.object.isRequired,
  refreshUserIndex: PropTypes.func.isRequired,
  page: PropTypes.number,
  limit: PropTypes.number,
};

export default UserCardTemplate;
