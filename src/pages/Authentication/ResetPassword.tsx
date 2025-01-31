import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../api/https';

const ResetPassword: React.FC = () => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState<string | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the token from the URL query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');

    if (token) {
      verifyToken(token);
    } else {
      setError('No token provided.');
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await axios.get(
        `${baseURL}/api/v1/auth/verifyResetPasswordToken/${token}`,
      );
      if (response.data.success) {
        setIsTokenValid(true);
      } else {
        setMessageContent(response.data.message);
      }
    } catch (err) {
      setError('This link has expired. Please request a new reset link.');
    }
  };

  const handleResetPassword = async (values: { newPassword: string; confirmPassword: string }) => {
    const { newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token'); // Extract token from query parameters

      if (!token) {
        setError('Token not found.');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${baseURL}/api/v1/auth/resetPassword/${token}`,
        { newPassword },
      );

      if (response.data.success) {
        message.success(response.data.message);
        form.resetFields(); // Reset form fields
        setTimeout(() => {
          navigate('/auth/signin'); // Redirect to Sign In page
        }, 1000); // Delay to show success message
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border dark:border-gray-700 dark:bg-gray-800">
        {!isTokenValid ? (
          <div className="text-center">
            {error && <p className="text-red-500">{error}</p>}
            {messageContent && <p className="text-green-500">{messageContent}</p>}
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-center mb-4 dark:text-white">Reset Your Password</h2>
            <Form layout="vertical" onFinish={handleResetPassword} form={form}>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[{ required: true, message: 'Please input your new password!' }]}
              >
                <Input.Password
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[{ required: true, message: 'Please confirm your new password!' }]}
              >
                <Input.Password
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  className='bg-primary text-white'
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </Form.Item>
            </Form>
            {error && (
              <>
                <p className="text-red-500">{error}</p>
                <Button type="link" onClick={() => navigate('/auth/signin')}>
                  Go to Sign In
                </Button>
              </>
            )}
            {messageContent && <p className="text-green-500 text-center">{messageContent}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
