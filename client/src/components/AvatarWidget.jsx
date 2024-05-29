import { mainAPI } from "../apis/mainAPI";
import { BsFillPersonFill } from "react-icons/bs";
import { useLoading } from "./LoadingContext";
import { ModalContext } from "./ModalContext";
import { useContext } from "react";

const AvatarWidget = ({ id, avatar, size="60px" }) => {
  const { setLoading } = useLoading();
  const { setIsOpen, modalContent, setModalContent } = useContext(ModalContext);
  
  const getUserProfile = async () => {
    try {
      if(id==='') return
      setLoading(true);
      const result = await mainAPI.getUserProfile({ id });
      setLoading(false);
      const { data } = result;
      setModalContent({
        ...modalContent,
        label: "UserProfile",
        content: data,
      });
      setIsOpen(true);
    } catch (err) {
      console.error(err);
    }
  };
  const btnStyle = `w-[${size}] h-[${size}] text-blue-800 flex bg-gray-100 p-1 m-auto rounded-full aspect-square shrink-0 grow-0`;
  
  return (
      <button
        className={btnStyle}
        onClick={() => getUserProfile()}
      >
        {avatar === "" ? (
          <BsFillPersonFill className="w-full h-full" />
        ) : (
          <img
            src={avatar}
            referrerPolicy="no-referrer"
            alt=""
            className="w-[100%] h-auto rounded-full"
          ></img>
        )}
      </button>
  );
};

export default AvatarWidget;
