import { BsArrowUpSquare } from "react-icons/bs";

const Footer = () => {
  const scrollToTop = () => {
    document.documentElement.scrollTop = 0;
  };

  return (
    <div className="sticky bottom-0 flex gap-1">
      <span className="self-center m-auto ">
        Copyright &copy; 2023 - {new Date().getFullYear()} Bombr
      </span>
      <button
        className="text-white bg-blue-700 py-2 px-2 hover:bg-blue-500"
        onClick={scrollToTop}
      >
        <BsArrowUpSquare size="2em" className="" />
      </button>
    </div>
  );
};

export default Footer;
