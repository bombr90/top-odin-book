const LoginWidget = ({ data, onChange, onSubmit }) => {
  const {
    credentials: { email, password },
  } = data;
  const maxLength = 64;
  const labelStyle = "m-1 font-bold text-sm text-gray-200";
  const inputStyle =
    "bg-gray-100 text-gray-400 font-bold rounded-t-sm border p-1 mx-1 h-8 text-med";

  return (
    <form
      className="flex flex-col m-2 bg-blue-700 rounded-md p-2 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
      onSubmit={onSubmit}
    >
      <div className="relative flex flex-col flex-1 gap-1">
        <span className="text-center font-bold text-lg">Login to OdinBook</span>
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
        <button
          type="submit"
          className="rounded-full bg-gray-100 px-4 py-1 text-gray-400 font-bold hover:bg-gray-300 self-end px-8 rounded-md m-2 disabled:cursor-not-allowed hover:cursor-pointer"
          disabled={password.length > 0 ? false : true}
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginWidget;
