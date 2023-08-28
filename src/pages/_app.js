import { useEffect, useState } from 'react';
import Login from './Login';
import { auth } from '../firebase';
import Register from './Register';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false); 
  
  useEffect(() => {
    return auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return user ? (
    <Component {...pageProps} />
  ) : isRegistering ? (
    <Register onSwitch={() => setIsRegistering(false)} />
  ) : (
    <Login onSwitch={() => setIsRegistering(true)} />
  );
}

export default MyApp;