import { useState, useEffect } from 'react'
import { userContext } from "./components/userContext";
import { ModalContext } from './components/ModalContext';
import { LoadingProvider } from './components/LoadingContext';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import './App.css'
import { authAPI } from './apis/authAPI';


function App() {
  //cache user data from cookie
  const [userData, setUserData] = useState(null);
  //provide state for modal context
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({label:'',content:'', id:''});

  useEffect(() => {
    (async () => {      
      const {user} = await authAPI.checkUser();
      if(user!==undefined){
        setUserData(user)
      }
    })();
  }, []);

  return (
    <>
      <LoadingProvider>
        <userContext.Provider value={{ userData, setUserData }}>
          <ModalContext.Provider
            value={{ isOpen, setIsOpen, modalContent, setModalContent }}
          >
            <Header />
            <Main />
            <Footer />
          </ModalContext.Provider>
        </userContext.Provider>
      </LoadingProvider>
    </>
  );
}

export default App
