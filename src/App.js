
import './assets/style/index.scss';
import { AuthContextProvider } from './services/auth/authContext';
import ChatRoutes from './Routes';
import useDarkMode from './theme/useDarkMode';
import 'eva-icons/style/eva-icons.css';
import useLang from './lang/useLang';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [theme] = useDarkMode();
  const [lang] = useLang();
  
  return (
    <AuthContextProvider>
      <ChatRoutes />
      <ToastContainer theme={theme} rtl={lang === "fa" ? true : false}/>
    </AuthContextProvider>
  );
}

export default App;
