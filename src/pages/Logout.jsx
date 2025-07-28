import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const doLogout = async () => {
      await supabase.auth.signOut();
      navigate('/login');
    };
    doLogout();
  }, [navigate]);
  return <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">Logging out...</div>;
};

export default Logout; 