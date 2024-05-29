import { BsArrowRightSquareFill, BsArrowLeftSquareFill } from "react-icons/bs";

const PaginationWidget = ({ refresh, limit, page, maxPage }) => {

  return (
      <span className="flex gap-2 self-center justify-self-center text-gray-500 font-bold items-center ">
        <button
          className="hover:text-blue-500 text-blue-700 p-1"
          onClick={() => refresh(Math.max(page - 1, 0), limit)}
        >
          <BsArrowLeftSquareFill size="2rem" color="inherit" />
        </button>
        <p>
          {page + 1}/{maxPage + 1}
        </p>
        <button
          onClick={() => refresh(Math.min(page + 1, maxPage), limit)}
          className="hover:text-blue-500 text-blue-700 p-1"
        >
          <BsArrowRightSquareFill size="2rem" color="inherit" />
        </button>
      </span>

  );
};

export default PaginationWidget;
