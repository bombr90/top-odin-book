import { RotatingLines } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div className="absolute absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-20">
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="48"
        visible={true}
      />
    </div>
  );
};

export default Spinner;
