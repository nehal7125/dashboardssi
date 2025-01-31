import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, message, Modal } from 'antd';
import { AiOutlineUser } from 'react-icons/ai';
import { MdLockOutline } from 'react-icons/md';
import { signInStart, signInSuccess, signInFailure } from '../../features/auth/authSlice';
import axios from 'axios';
import { baseURL } from '../../api/https';
import gsap from 'gsap';
import { AppDispatch, RootState } from '../../store/index';

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, isSigningIn } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

  useEffect(() => {
    const timeline = gsap.timeline();
    timeline.fromTo('.signin-form', { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power2.out' });
    timeline.fromTo(
      '.logo',
      { y: -200, scale: 2, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 1, ease: 'bounce' },
    );
    timeline.fromTo('.left-side-image', { x: -200, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power2.out' });
    timeline.fromTo('footer', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'bounce' }, '+=0.2');
  }, []);

  const validateForm = () => {
    return email && password;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    dispatch(signInStart());
    try {
      const user = await apiSignIn(email, password);
      const token = { authToken: user.access_token, role: user.role_name };
      dispatch(signInSuccess(token));
      navigate('/dashboard');
      message.success('Signed in successfully');
    } catch (err: any) {
      dispatch(signInFailure(err?.message || 'Invalid credentials'));
    }
  };

  const apiSignIn = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${baseURL}/api/v1/auth/login`, {
        email,
        password,
      });
      const { access_token, name, role_name, preferred_timezone } = response.data.result;
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('username', name);
      localStorage.setItem('role', role_name);
      localStorage.setItem('preferred_timezone', preferred_timezone);
      return { access_token, role_name };
    } catch (error: any) {
      throw new Error(error.response?.data?.message);
    }
  };

  const handleForgotPassword = async () => {
    setIsForgotPasswordLoading(true);
    try {
      const response = await axios.post(`${baseURL}/api/v1/auth/sendResetPasswordLink`, { email: forgotEmail });
      if (response.data.success) {
        message.success(response.data.message);
        setIsForgotPasswordModalVisible(false);
      } else {
        message.error('Email not found');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Email not found');
      setIsForgotPasswordModalVisible(false);
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const showForgotPasswordModal = () => {
    setIsForgotPasswordModalVisible(true);
  };

  const handleCancelForgotPassword = () => {
    setIsForgotPasswordModalVisible(false);
  };

  const redirectToSignUp = () => {
    navigate('/auth/signup'); // Redirect to the Sign-Up page
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-white dark:bg-gray-800">
      {/* Main Section */}
      <div className="flex flex-wrap w-full lg:w-203 my-7 mx-4 lg:mx-36 shadow-lg rounded-2xl">
        {/* Left Side: Image */}
        <div className="hidden lg:block lg:w-1/2 left-side-image">
          <img src="/assets/imgs/SEI.png" alt="Sign In" className="object-cover w-full h-full rounded-l-2xl" />
        </div>

        {/* Right Side: Sign In Form */}
        <div className="flex flex-1 items-center justify-center p-6 bg-white dark:bg-boxdark border-slate-200 dark:border-strokedark signin-form rounded-lg lg:rounded-r-2xl">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-4">
              <img src="/assets/imgs/safety.png" alt="Logo" className="w-26 h-auto logo" />
            </div>
            <h1 className="text-2xl font-bold text-black dark:text-white text-center mb-6">Safe Sphere Innovations</h1>
            <h2 className="text-xl font-bold text-black dark:text-white text-center mb-6">Sign In</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <Form layout="vertical" className="flex flex-col justify-center items-center" onFinish={handleSignIn}>
              <Form.Item
                name="email"
                className="w-5/6 group"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Invalid email format' },
                ]}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  prefix={<AiOutlineUser />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="group-hover:border-secondary focus:border-secondary"
                />
              </Form.Item>

              <Form.Item
                name="password"
                className="w-5/6 mb-0 group"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password
                  prefix={<MdLockOutline />}
                  placeholder="6+ Characters, 1 Capital letter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="group-hover:border-secondary focus:border-secondary"
                />
              </Form.Item>

              <Form.Item className="w-5/6">
                <div className="flex justify-center mt-1">
                  <Button
                    type="link"
                    className="pr-0 text-secondary hover:!text-tertiary"
                    onClick={showForgotPasswordModal}
                  >
                    Forgot Password?
                  </Button>
                </div>
              </Form.Item>

              <Form.Item className="w-5/6">
                <Button className="creative-button bg-primary text-white" htmlType="submit" block loading={isSigningIn}>
                  {isSigningIn ? 'Signing In...' : 'Sign In'}
                </Button>
              </Form.Item>

              <Form.Item className="w-5/6">
                <div className="flex justify-center mt-1">
                  <span className="pr-0 text-black dark:text-white">
                    Don't have an account?
                    <Button type="link" className="text-secondary pr-0 hover:!text-tertiary" onClick={redirectToSignUp}>
                      Sign Up
                    </Button>
                  </span>
                </div>
              </Form.Item>
            </Form>

            <div className="mt-2 text-sm flex justify-center">
              <a href="#" className="text-secondary hover:underline transition-all duration-200 mr-4">
                Terms and Conditions
              </a>
              <a href="#" className="text-secondary hover:underline transition-all duration-200">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-white text-center py-4 text-tertiary dark:bg-gray-800 dark:text-white">
        &copy; {new Date().getFullYear()} Powered by InspectGuard mobile app.
      </footer>

      {/* Forgot Password Modal */}
      <Modal
        title="Forgot Password"
        open={isForgotPasswordModalVisible}
        onCancel={handleCancelForgotPassword}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleForgotPassword}>
          <Form.Item label="Email" name="forgotEmail" rules={[{ required: true, message: 'Please enter your email' }]}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
          </Form.Item>

          <div className="flex justify-end">
            <Button onClick={handleCancelForgotPassword} style={{ marginRight: '8px' }}>
              Cancel
            </Button>
            <Button className="bg-primary text-white" htmlType="submit" loading={isForgotPasswordLoading}>
              {isForgotPasswordLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SignIn;
