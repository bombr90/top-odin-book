import Modal from "./Modal";
import Spinner from "./Spinner"
import { useLoading } from "./LoadingContext";

const Main = () => {
  const { loading } = useLoading();

  return (
    <>
      <div className="flex flex-col bg-gray-200 h-[100%] text-grey-500">
        <Modal />
        {loading && <Spinner />}
      </div>
    </>
  );
};

export default Main;
