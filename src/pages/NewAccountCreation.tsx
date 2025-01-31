import { useState } from 'react';
import { Steps, Form, Input, Select, Checkbox, Button, Card } from 'antd';
import 'tailwindcss/tailwind.css';

const { Step } = Steps;
const { Option } = Select;

const NewAccountCreation = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [accountType, setAccountType] = useState<string>('');

  const next = () => setCurrentStep(currentStep + 1);
  const prev = () => setCurrentStep(currentStep - 1);

  const handleAccountTypeChange = (value: string) => {
    setAccountType(value);
    setCurrentStep(0); // Reset to step 1 when account type changes
  };

  const renderFormFields = () => {
    if (accountType === 'Inspection company') {
      if (currentStep === 0) {
        return (
          <>
            <div className="bg-white p-6 shadow-md rounded-lg mt-6">
            <div className="grid grid-cols-2 gap-6">
            <Form.Item className='mb-0' label="First Name" name="firstName" rules={[{ required: true, message: 'First name is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Last Name" name="lastName" rules={[{ required: true, message: 'Last name is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Phone Number" name="phoneNumber" rules={[{ required: true, message: 'Phone number is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Company Name" name="companyName" rules={[{ required: true, message: 'Company name is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Role within the company" name="role" rules={[{ required: true, message: 'Role is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Create Password" name="password" rules={[{ required: true, message: 'Password is required' }]}> 
              <Input.Password /> 
            </Form.Item>
            </div>
            </div>
          </>
        );
      } else if (currentStep === 1) {
        return (
          <>
            <div className="bg-white p-6 shadow-md rounded-lg mt-6">
            <div className="grid grid-cols-2 gap-6">
            <Form.Item className='mb-0' label="No of Employees" name="employees" rules={[{ required: true, message: 'Number of employees is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Average No of Inspections per Month" name="inspections" rules={[{ required: true, message: 'Average inspections are required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Equipment Types Inspected" name="equipmentTypes"> 
              <Checkbox.Group>
                <Checkbox value="fire_extinguishers">Fire Extinguishers</Checkbox>
                <Checkbox value="first_aid">First Aid Kits</Checkbox>
              </Checkbox.Group>
            </Form.Item>
            </div>
            </div>
          </>
        );
      }
    } else if (accountType === 'Equipment Owner') {
      if (currentStep === 0) {
        return (
          <>
            <div className="bg-white p-6 shadow-md rounded-lg mt-6">
            <div className="grid grid-cols-2 gap-6">
            <Form.Item className='mb-0' label="First Name" name="firstName" rules={[{ required: true, message: 'First name is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Last Name" name="lastName" rules={[{ required: true, message: 'Last name is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Phone Number" name="phoneNumber" rules={[{ required: true, message: 'Phone number is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Company Name" name="companyName" rules={[{ required: true, message: 'Company name is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Role within the company" name="role" rules={[{ required: true, message: 'Role is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Create Password" name="password" rules={[{ required: true, message: 'Password is required' }]}> 
              <Input.Password /> 
            </Form.Item>
            </div>
            </div>
          </>
        );
      } else if (currentStep === 1) {
        return (
          <>
            <div className="bg-white p-6 shadow-md rounded-lg mt-6">
            <div className="grid grid-cols-2 gap-6">
            <Form.Item className='mb-0' label="Type of Company" name="companyType" rules={[{ required: true, message: 'Company type is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Number of Properties/Equipment" name="properties" rules={[{ required: true, message: 'Number of properties is required' }]}> 
              <Input /> 
            </Form.Item>
            <Form.Item className='mb-0' label="Number of Users" name="users" rules={[{ required: true, message: 'Number of users is required' }]}> 
              <Input /> 
            </Form.Item>
            </div>
            </div>
          </>
        );
      }
    }
    return null;
  };

  const renderPricingTable = () => {
    return (
    <div className="bg-white p-6 shadow-md rounded-lg mt-6">
        <h2 className="text-3xl font-semibold text-center mb-8">Choose the right plan for you</h2>
      <div className="grid grid-cols-3 gap-8 mt-8">
        <Card title="Free Plan" bordered={true} className="text-center">
          <p>Basic access with limited features</p>
          <p className="text-lg font-semibold">$0/month</p>
          <Button className="mt-4">Select</Button>
        </Card>
        <Card title="Standard Plan" bordered={true} className="text-center">
          <p>Advanced features for growing companies</p>
          <p className="text-lg font-semibold">$29/month</p>
          <Button className="mt-4">Select</Button>
        </Card>
        <Card title="Premium Plan" bordered={true} className="text-center">
          <p>All features with priority support</p>
          <p className="text-lg font-semibold">$49/month</p>
          <Button className="mt-4">Select</Button>
        </Card>
      </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-semibold text-center mb-8">New User Registration</h1>
      <Select placeholder="Select Account Type" onChange={handleAccountTypeChange} className="w-full mb-6">
        <Option value="Inspection company">Inspection Company</Option>
        <Option value="Equipment Owner">Equipment Owner</Option>
      </Select>
      {
        !accountType && (
        <div className="bg-white p-10 rounded-md shadow-sm">
           <p className="text-lg font-medium text-center">📝 How to Complete Your Registration</p>
           <div className="flex justify-center mt-2">
             <div className="flex space-x-8 mt-6">
               <div className='border-dashed border-2 p-3 border-grey'>🔽 <strong>Select Account Type:</strong> Choose an account type to begin.</div>
               <div className='border-dashed border-2 p-3 border-grey'>👤 <strong>Step 1:</strong> Fill in personal and company details.</div>
               <div className='border-dashed border-2 p-3 border-grey'>🏢 <strong>Step 2:</strong> Enter company-specific information.</div>
               <div className='border-dashed border-2 p-3 border-grey'>📋 <strong>Step 3:</strong> Select your subscription plan.</div>
             </div>
           </div>
         </div>
        )
      }
      {accountType && (
        <>
      <Steps current={currentStep}>
        <Step title="Personal Information" />
        <Step title="Company Information" />
        <Step title="Plan" />
      </Steps>

      <Form layout="vertical" className="mt-8">
      {currentStep < 2 ? renderFormFields() : renderPricingTable()}
        <div className="flex justify-between mt-6">
          {currentStep > 0 && (
            <Button onClick={prev}>Previous</Button>
          )}
          {currentStep < 2 && (
            <Button type="primary" className=' bg-primary p-3 font-medium text-gray hover:bg-opacity-90' onClick={next}>Next</Button>
          )}
        </div>
      </Form>
      </>
      )}
    </div>
  );
};

export default NewAccountCreation;
