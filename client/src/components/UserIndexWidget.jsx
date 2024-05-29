import { useContext } from "react";
import UserCardTemplate from "./UserCardTemplate";
import { mainAPI } from "../apis/mainAPI";
import { ModalContext } from "./ModalContext";
import { useLoading } from "./LoadingContext";
import PaginationWidget from "./PaginationWidget";

const UserIndexWidget = ({data}) => {
  const { setLoading } = useLoading();
  const {
    label,
    content: { users, limit, page, maxPage },
  } = data;
  const { modalContent, setModalContent } = useContext(ModalContext);

  const refreshUserIndex = async (page, limit) => {
    try {
      setLoading(true)
      const result = await mainAPI.userIndex(page, limit);
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

  return (
    <div key={label} className="flex flex-col justify-start h-[100%] ">
      {users.map((user) => (
        <UserCardTemplate
          key={user._id}
          refreshUserIndex={refreshUserIndex}
          userData={user}
          page={page}
          limit={limit}
        />
      ))}
      <PaginationWidget
        refresh={refreshUserIndex}
        page={page}
        limit={limit}
        maxPage={maxPage}
      />
    </div>
  );
}

export default UserIndexWidget