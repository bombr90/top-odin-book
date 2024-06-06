import { useContext } from "react";
import { ModalContext } from "./ModalContext";
import { userContext } from "./userContext";
import { authAPI } from "../apis/authAPI";
import { useLoading } from "./LoadingContext";
import {mainAPI} from "../apis/mainAPI"
import { PropTypes } from "prop-types";

const LoginWidget = ({ data, onChange, onSubmit }) => {
  const {
    credentials: { email, password },
  } = data;
  const maxLength = 64;
  const labelStyle = "m-1 font-bold text-sm text-gray-200";
  const inputStyle =
    "bg-gray-100 text-gray-400 font-bold rounded-t-sm border p-1 mx-1 h-8 text-med";
  const btnStyle =
    "flex-1 rounded-full bg-gray-100 px-2 py-1 text-gray-400 font-bold hover:bg-gray-300 px-8 rounded-md m-2 disabled:cursor-not-allowed hover:cursor-pointer text-sm";

  const { setLoading } = useLoading();
  const { setIsOpen, modalContent, setModalContent } =
    useContext(ModalContext);
  const { setUserData } = useContext(userContext);

  const guestLogin = async () => {
    try {
      const credentials = {
        email: "guest@user.com",
        password: "password",
      };
      setLoading(true);
      const result = await authAPI.loginLocal(credentials);
      const { user } =
        result.user !== undefined ? await mainAPI.getUserData() : null;
      setLoading(false);
      setUserData(user);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const registerPopup = async () => {
    setIsOpen(true);
    setModalContent({
      ...modalContent,
      label: "Register",
      userProfile: {
        displayName: "",
        email: "",
        firstName: "",
        lastName: "",
        avatar: "",
        password: "",
      },
    });
  };

  return (
    <div className="flex flex-col m-2 bg-blue-700 rounded-md p-2 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <form className="flex flex-col" onSubmit={onSubmit}>
        <div className="relative flex flex-col flex-1 gap-1">
          <span className="text-center font-bold text-lg">
            Login to OdinBook
          </span>
          <label htmlFor="email" className={labelStyle}>
            Email
          </label>
          <input
            placeholder="email"
            autoComplete="username"
            className={inputStyle}
            type="email"
            value={email}
            onChange={onChange}
            maxLength={maxLength}
            name="email"
            id="email"
          ></input>
          <label htmlFor="password" className={labelStyle}>
            Password
          </label>
          <input
            placeholder="password"
            autoComplete="current-password"
            className={inputStyle}
            type="password"
            value={password}
            onChange={onChange}
            maxLength={maxLength}
            id="password"
            name="password"
          ></input>
          <div className="flex">
            <button
              className={btnStyle}
              type="button"
              onClick={() => guestLogin()}
            >
              Guest Login
            </button>
            <button
              type="submit"
              className={btnStyle}
              disabled={password.length > 0 ? false : true}
            >
              Login
            </button>
          </div>
        </div>
      </form>
      <p className="text-xs self-center">Not registered?</p>
      <button
        type="button"
        className={btnStyle + " text-sm self-center"}
        onClick={() => registerPopup()}
      >
        Create Account
      </button>
    </div>
  );
};

LoginWidget.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default LoginWidget;
