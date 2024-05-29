const RegisterWidget = ({ data, onChange, onSubmit }) => {
  const {
    userProfile: { email, displayName, firstName, lastName, avatar, password },
  } = data;

  const maxLength = 64;
  const labelStyle = "m-1 font-bold text-sm text-gray-200";
  const inputStyle =
    "bg-gray-100 text-gray-400 font-bold rounded-t-sm border p-1 mx-1 h-8 text-med";

  return (
    <form
      className="flex flex-col m-2 bg-blue-700 rounded-md p-2 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
      onSubmit={onSubmit}
      autoComplete="new-password"
      method="post"
    >
      <div className="relative flex flex-col flex-1 gap-1">
        <span className="text-center font-bold text-lg">
          Register OdinBook Account
        </span>
        <label htmlFor="email" className={labelStyle}>
          Email*
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
          Password*
        </label>
        <input
          placeholder="password"
          autoComplete="new-password"
          className={inputStyle}
          type="password"
          value={password}
          onChange={onChange}
          maxLength={maxLength}
          id="password"
          name="password"
        ></input>
        <label htmlFor="displayName" className={labelStyle}>
          Display Name*
        </label>
        <input
          placeholder="Display Name"
          className={inputStyle}
          type="text"
          value={displayName}
          onChange={onChange}
          maxLength={maxLength}
          id="displayName"
          name="displayName"
        ></input>
        <label htmlFor="firstName" className={labelStyle}>
          First Name
        </label>
        <input
          placeholder="First Name"
          className={inputStyle}
          type="text"
          value={firstName}
          onChange={onChange}
          maxLength={maxLength}
          id="firstName"
          name="firstName"
        ></input>
        <label htmlFor="lastName" className={labelStyle}>
          Last Name
        </label>
        <input
          placeholder="Last Name"
          className={inputStyle}
          type="text"
          value={lastName}
          onChange={onChange}
          maxLength={maxLength}
          id="lastName"
          name="lastName"
        ></input>
        <label htmlFor="avatar" className={labelStyle}>
          Avatar URL
        </label>
        <input
          placeholder="Avatar URL"
          disabled={true}
          className={inputStyle + " cursor-not-allowed"}
          type="text"
          value={avatar}
          onChange={onChange}
          id="avatar"
          name="avatar"
        ></input>
        * Required
        <button
          type="submit"
          className="rounded-full bg-gray-100 px-4 py-1 text-gray-400 font-bold hover:bg-gray-300 self-end px-8 rounded-md m-2 disabled:cursor-not-allowed hover:cursor-pointer"
          disabled={
            password.length > 0 && displayName.length > 0 && email.length > 0
              ? false
              : true
          }
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterWidget;
