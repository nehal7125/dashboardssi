// src/pages/NotFound.tsx
import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to="/dashboard">
            <Button type="primary">Back to Home</Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
