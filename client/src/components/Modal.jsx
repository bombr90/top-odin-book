import { Dialog, Transition } from "@headlessui/react";
import { useContext, Fragment } from "react";
import PostWidget from "./PostWidget";
import { ModalContext } from "./ModalContext";
import { mainAPI } from "../apis/mainAPI";
import UserIndexWidget from "./UserIndexWidget";
import UserFeedWidget from "./UserFeedWidget";
import PostDetailsWidget from "./PostDetailsWidget"
import { useLoading } from "./LoadingContext";
import { userContext } from "./userContext";
import LoginWidget from "./LoginWidget";
import { authAPI } from "../apis/authAPI";
import RegisterWidget from "./RegisterWidget";
import UserProfileWidget from "./UserProfileWidget";

const Modal = () => {
  const { isOpen, setIsOpen, modalContent, setModalContent  } = useContext(ModalContext);
  const {setLoading} = useLoading();
  const { userData, setUserData } = useContext(userContext);

  const onChangeHandler = (event) => {
    switch (modalContent.label) {
      case "Post":
      case "Comment":
        setModalContent((prev) => ({
          ...prev,
          content: event.target.value,
        }));
        break;
      case "Login":
        setModalContent((prev) => ({
          ...prev,
          credentials: {
            ...prev.credentials,
            [event.target.name]: event.target.value,
          },
        }));
        break;
      case "Register":
        setModalContent((prev) => ({
          ...prev,
          userProfile: {
            ...prev.userProfile,
            [event.target.name]: event.target.value,
          },
        }));
        break;
    }
  };

  const clearModal = () => {
    switch (modalContent.label) {
      case "Post":
      case "Comment":
        setModalContent((prev) => ({
          ...prev,
          content: "",
        }));
        break;
      case "Login":
        setModalContent((prev) => ({
          ...prev,
          credentials: {
            ...prev.credentials,
            password: "",
          },
        }));
        break;
      case "Register":
        setModalContent((prev) => ({
          ...prev,
          userProfile: {
            ...prev.userProfile,
            password: "",
          },
        }));
        break;
    }
  };

  const onSubmitHandler = async (event) => {
    try {
      let result = {};
      setLoading(true);
      switch (modalContent.label) {
        case "Post":
          result = await mainAPI.postPost(modalContent);
          if(result.data) {
            clearModal();
          }
          break;
        case "Comment":
          result = await mainAPI.postComment(modalContent);
          if (result.data) {
            clearModal();
          }
          break;
        case "Login":
          event.preventDefault();
          result = await authAPI.loginLocal(modalContent.credentials);
          if (result.user === undefined) alert(result.error);
          if (result.user !== undefined) {
            const { user } = await authAPI.checkUser();
            setUserData(user);
            clearModal();
          }
          break;
        case "Register":
          event.preventDefault();
          result = await authAPI.registerUser(modalContent.userProfile);
          if (result.data === undefined) alert(result.message);
          if (result.data !== undefined) {
            const credentials = {
              email: modalContent.userProfile.email,
              password: modalContent.userProfile.password,
            };
            const result2 = await authAPI.loginLocal(credentials);
            if (result2.user === undefined) alert(result2.error);
            if (result2.user !== undefined) {
              const { user } = await authAPI.checkUser();
              setUserData(user);
              clearModal();
            }
          }
          break;
      }
      setLoading(false);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Transition show={isOpen}>
      <Dialog
        onClose={() => setIsOpen(false)}
        className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 min-w-[50%] max-w-[512px] min-h-[50%] max-h-[512px] rounded-md border border-gray-400 bg-gray-200 opacity-95 flex overflow-y-scroll  "
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          className=""
        >
          <Dialog.Panel className="flex-1">
            {modalContent.label === "Comment" ||
            modalContent.label === "Post" ? (
              <PostWidget
                onChange={onChangeHandler}
                onSubmit={onSubmitHandler}
                data={modalContent}
              />
            ) : modalContent.label === "UserIndex" ? (
              <UserIndexWidget data={modalContent} />
            ) : modalContent.label === "UserFeed" ? (
              <UserFeedWidget data={modalContent} />
            ) : modalContent.label === "PostDetails" ? (
              <PostDetailsWidget data={modalContent} />
            ) : modalContent.label === "UserProfile" ? (
              <UserProfileWidget data={modalContent} />
            ) : modalContent.label === "Login" ? (
              <LoginWidget
                onChange={onChangeHandler}
                onSubmit={onSubmitHandler}
                data={modalContent}
              />
            ) : modalContent.label === "Register" ? (
              <RegisterWidget
                onChange={onChangeHandler}
                onSubmit={onSubmitHandler}
                data={modalContent}
              />
            ) : (
              ""
            )}
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Modal;
