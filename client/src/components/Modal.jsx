import { Dialog, Transition } from "@headlessui/react";
import { useContext, Fragment } from "react";
import PostWidget from "./PostWidget";
import { ModalContext } from "./ModalContext";
import { mainAPI } from "../apis/mainAPI";
import UserIndexWidget from "./UserIndexWidget";
import UserFeedWidget from "./UserFeedWidget";
import PostDetailsWidget from "./PostDetailsWidget";
import { useLoading } from "./LoadingContext";
import UserProfileWidget from "./UserProfileWidget";

const Modal = () => {
  const { isOpen, setIsOpen, modalContent, setModalContent } =
    useContext(ModalContext);
  const { setLoading } = useLoading();

  const onChangeHandler = (event) => {
    switch (modalContent.label) {
      case "Post":
      case "Comment":
        setModalContent((prev) => ({
          ...prev,
          content: event.target.value,
        }));
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
    }
  };

  const onSubmitHandler = async () => {
    try {
      let result = {};
      setLoading(true);
      switch (modalContent.label) {
        case "Post":
          result = await mainAPI.postPost(modalContent);
          if (result.data) {
            clearModal();
          }
          break;
        case "Comment":
          result = await mainAPI.postComment(modalContent);
          if (result.data) {
            clearModal();
          }
      }
      setLoading(false);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Transition show={isOpen}>
      <Dialog
        onClose={() => setIsOpen(false)}
        className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-w-[320px] max-w-[480px] min-h-[320px] max-h-[480px] rounded-md border border-gray-400 bg-gray-200 flex overflow-auto"
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
          <Dialog.Panel className="flex flex-1">
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
