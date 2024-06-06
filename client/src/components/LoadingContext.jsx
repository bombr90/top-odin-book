import {createContext, useContext, useState} from "react";
import PropTypes from "prop-types";

const LoadingContext = createContext({
  loading: false,
  setLoading: null,
});

function LoadingProvider({children}){
  const [loading, setLoading] = useState(false);
  const value = {loading, setLoading};
  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

function useLoading(){
  try{
    const context = useContext(LoadingContext);
    if(!context){
      throw new Error('useLoading must be used within LoadingProvider.') 
    }
    return context
   } catch (err) {
        console.error(err);
      }
  
}

LoadingProvider.propTypes = {
  children: PropTypes.any,
};

export { LoadingProvider, useLoading };
