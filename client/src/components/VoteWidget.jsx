import { BsFillHandThumbsUpFill } from "react-icons/bs";
import PropTypes from "prop-types";

const VoteWidget = ({ likeCount, onClick }) => {
  return (
    <div className={`flex items-center justify-center gap-1 text-blue-500`}>
      <BsFillHandThumbsUpFill
        onClick={() => onClick()}
        className="p-1 fill-blue-400 hover:fill-blue-500 hover:cursor-pointer"
        size={30}
      />
      {likeCount || "Like"}
    </div>
  );
};

VoteWidget.propTypes = {
  likeCount: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};

export default VoteWidget;
