import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../features/auth/authSlice';
import { message } from 'antd';

const ResetPasswordMessage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setTimeout(() => {
      dispatch(signOut());
      navigate('/auth/signin');
      message.success('Signed out successfully');
    }, 1000);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-lg font-semibold mb-4">
          For resetting your password, please sign out first.
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordMessage;
