import React from "react";

const userContext = React.createContext({
  displayName: null,
  avatar: null,
  id: null,
});

export { userContext };
