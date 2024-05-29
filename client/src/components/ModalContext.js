import React from "react";

const ModalContext = React.createContext({
  id: '',
  credentials: {
    email: '',
    password: '',
  },
  content: '',
  label: '',
  userProfile: {
    displayName: '',
    email: '',
    firstName: '',
    lastName: '',
    avatar: '',
    password: '',
  }
});

export { ModalContext };