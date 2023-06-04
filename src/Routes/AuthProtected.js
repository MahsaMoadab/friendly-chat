import { Navigate } from "react-router-dom";
import { routes } from './routes';

const AuthProtected = ({ user, children }) => {
  const { chat } = routes;
    if (!user) {
      return children;
    }
    return <Navigate to={chat} />;
  };

export default AuthProtected;