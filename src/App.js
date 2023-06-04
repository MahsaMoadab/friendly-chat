
import './assets/style/index.scss';
import { AuthContextProvider } from './services/auth/authContext';
import ChatRoutes from './Routes';
import useDarkMode from './theme/useDarkMode';
import 'eva-icons/style/eva-icons.css';

function App() {
  const [theme] = useDarkMode();

  return (
    <AuthContextProvider>
      <ChatRoutes />
    </AuthContextProvider>
  );
}

export default App;
