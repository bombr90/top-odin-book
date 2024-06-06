import { useContext, useEffect } from "react";
import { userContext } from "./userContext";
import Spinner from "./Spinner";
import { useLoading } from "./LoadingContext";
import LoginWidget from "./LoginWidget";
import RegisterWidget from "./RegisterWidget";
import { ModalContext } from "./ModalContext";
import { authAPI } from "../apis/authAPI";
import { mainAPI } from "../apis/mainAPI";

const MemberWall = () => {
  const { loading, setLoading } = useLoading();
  const { modalContent, setModalContent, setIsOpen } =
    useContext(ModalContext);
  const { setUserData } = useContext(userContext);
  useEffect(() => {
    setModalContent((prev) => ({
      ...prev,
      label: "Login",
      credentials: {
        email: "",
        password: "",
      },
    }));
  }, [setModalContent]);

  const onChangeHandler = (event) => {
    switch (modalContent.label) {
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

  const backLoginHandler = () => {
     setModalContent((prev) => ({
       ...prev,
       label: "Login",
     }));
  }

  const clearModal = () => {
    switch (modalContent.label) {
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
      let resultLogin = {};

      setLoading(true);
      switch (modalContent.label) {
        case "Login":
          event.preventDefault();
          resultLogin = await authAPI.loginLocal(modalContent.credentials);
          if (resultLogin.user === undefined) alert(resultLogin.error);
          if (resultLogin.user !== undefined) {
            const { user } = await mainAPI.getUserData();
            setUserData(user);
            clearModal();
            setIsOpen(false);
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
            const resultLogin = await authAPI.loginLocal(credentials);
            if (resultLogin.user === undefined) alert(resultLogin.error);
            if (resultLogin.user !== undefined) {
              const { user } = await mainAPI.getUserData();
              setUserData(user);
              clearModal();
              setIsOpen(false);
            }
          }
          break;
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex flex-col bg-gray-200 h-[100%] color-grey-600 text-grey-500">
        {loading && <Spinner />}
        {modalContent.label === "Login" ? (
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
            backLogin={backLoginHandler}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default MemberWall;
