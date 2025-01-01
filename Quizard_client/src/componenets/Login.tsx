import { useAuth0 } from '@auth0/auth0-react';

const Login: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();

  if (isAuthenticated && user) {
    return (
      <div>
        <h2>Welcome {user.name}</h2>
        <button onClick={() => logout({ 
          logoutParams: {
            returnTo: window.location.origin
          }
        })}>
          Log Out
        </button>
      </div>
    );
  }

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

export default Login;