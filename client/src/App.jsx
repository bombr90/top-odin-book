import { useState, useEffect } from 'react'
import { userContext } from "./components/userContext";
import { ModalContext } from './components/ModalContext';
import { LoadingProvider } from './components/LoadingContext';
import MemberWall from "./components/MemberWall"
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import './App.css'
import { mainAPI } from "./apis/mainAPI"; 
import {
  Routes,
  Route,
  useNavigate,
  Navigate
} from "react-router-dom";

function App() {
  //cache user data from cookie
  const [userData, setUserData] = useState(null);
  //provide state for modal context
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({label:'',content:'', id:''});

const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const result = await mainAPI.getIsAuth();
      if (result.auth) {
        const { user } = await mainAPI.getUserData();
        setUserData(user);
        navigate("/api/v1/");
      } else {
        navigate("/auth/v1/login");
      }
    })();
  }, []);

   useEffect(() => {
     if (userData === null) {
       navigate("/auth/v1/login", { replace: true });
     } else {
       navigate("/api/v1/", { replace: true });
     }
   }, [userData]);

  return (
    <>
      <userContext.Provider value={{ userData, setUserData }}>
        <ModalContext.Provider
          value={{ isOpen, setIsOpen, modalContent, setModalContent }}
        >
          <LoadingProvider>
            <Routes>
              <Route path="/auth/v1/login" element={<MemberWall />} />
              <Route
                path="/api/v1/"
                element={
                  <>
                    <Header />
                    <Main />
                    <Footer />
                  </>
                }
              />
              <Route path="*" element={<Navigate to="/api/v1" replace />} />
            </Routes>
          </LoadingProvider>
        </ModalContext.Provider>
      </userContext.Provider>
    </>
  );
}

export default App
