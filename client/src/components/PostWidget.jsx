import { BsCardImage } from "react-icons/bs";

const PostWidget = ({data, onChange, onSubmit}) => {
  const {label, content} = data;
  const maxLength = 512
  const charCounter = () => maxLength - content.length

  return (
    <div className="flex flex-col h-[100%]">
      <div className="relative flex flex-col flex-1">
        <textarea
          placeholder={`New ${label}...`}
          className="bg-gray-100 text-gray-400 rounded-t-md border border-x-gray-400 border-t-gray-400 p-2 resize-none focus:outline-none flex-1"
          value={content}
          onChange={onChange}
          maxLength={maxLength}
          name="content"
        ></textarea>
        <div className="absolute bottom-1 right-4 text-xs font-semibold  text-gray-400">
          {charCounter()}/{maxLength} chars left
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 rounded-b-md border border-x-gray-400 border-b-gray-400 bg-gray-200 px-2 py-1">
        <button
          className="disabled:cursor-not-allowed"
          disabled={true}
          onClick={() => console.log("This functionality has not been added")}
        >
          <BsCardImage
            size={30}
            className="fill-gray-400 hover:fill-gray-300"
          />
        </button>
        <button
          className="rounded-full bg-gray-400 px-4 py-1 text-slate-200 hover:bg-gray-300 disabled:cursor-not-allowed hover:cursor-pointer"
          onClick={() => onSubmit()}
          disabled={content.length > 0 ? false : true}
        >
          {`Submit ${label}`}
        </button>
      </div>
    </div>
  );
}

export default PostWidget