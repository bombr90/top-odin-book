// import { useContext } from "react";
// import { userContext } from "./userContext";
import Modal from "./Modal";
import Spinner from "./Spinner"
import { useLoading } from "./LoadingContext";

const Main = () => {
  // const {userData} = useContext(userContext);
  const {loading} = useLoading();

  return (
    <>
      <div className="flex flex-col bg-gray-200 h-[100%] color-grey-600 text-grey-500">
        {/* <div className="text-gray-500 bg-blue-200 flex-row break-words">
          {userData ? <div>{JSON.stringify(userData)}</div> : "Not logged in"}
        </div> */}
        <Modal />
        {loading && <Spinner />}
      </div>
    </>
  );
};

export default Main;
