import React, { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Table,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Spin,
  Switch,
} from 'antd';
// import axios from 'axios';
import 'antd/dist/reset.css'; // Import AntD styles
import '../../css/customPagination.css';
import { FaEdit, FaSearch } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '../../store/hooks/index';
import { useNavigate } from 'react-router-dom';
import {
  addCompanyUser,
  deleteCompanyUser,
  editCompanyUser,
  getAllCompanies,
  getAllCompanyUsers,
} from '../../api/api';

type AddCompanyUserRequest = {
  company_id: number;
  user_fname: string;
  user_lname: string;
  user_email: string;
};
const CustomerProfilePage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermValue, setSearchTermValue] = useState('');

  const [selectedCompanyUser, setSelectedCompanyUser] = useState<User | null>(
    null,
  );
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // Fetch company user data
  const { data: customerData, isLoading } = useQuery({
    queryKey: ['companyUser', page, limit, searchTermValue],
    queryFn: () =>
      getAllCompanyUsers(page, limit, searchTermValue, dispatch, navigate),
    // keepPreviousData: true,
  });

  // Fetch Companies data
  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: () => getAllCompanies(1, 'nolimit'),
    select: (data) =>
      data?.result?.data?.filter((company) => company.status === true), // Filter for active companies only
    // keepPreviousData: true,
  });

  // console.log('companiesData', companiesData);

  useEffect(() => {
    setPage(1);
  }, [searchTermValue]);

  // Add company mutation
  const mutationAdd = useMutation({
    mutationFn: (newCompanyUser: AddCompanyUserRequest) =>
      addCompanyUser(newCompanyUser, dispatch, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyUser'] });
      setIsAddModalVisible(false);
      message.success('Company user added successfully');
      form.resetFields();
    },
    onError: (error: any) => {
      console.log(error);
      if (error.response && error.response.data) {
        const { errors } = error.response.data;
        console.log(errors);

        if (errors) {
          errors.forEach((err: { field: string; message: string }) => {
            form.setFields([
              {
                name: err.field,
                errors: [err.message],
              },
            ]);
          });
        } else if (error?.response?.status === 409) {
          error?.response?.data?.error === 'contact_phone_UNIQUE must be unique'
            ? message.error('Phone already exists.')
            : message.error('Email already exists.');
        } else {
          message.error('An unexpected error occurred.');
        }
      } else {
        message.error('An unexpected error occurred.');
      }
    },
  });

  const mutationEdit = useMutation({
    mutationFn: (
      updatedCompanyUser: AddCompanyUserRequest & { user_id: number },
    ) => editCompanyUser(updatedCompanyUser, dispatch, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyUser'] });
      setIsEditModalVisible(false);
      setSelectedCompanyUser(null);
      message.success('Company user updated successfully');
    },
    onError: (error: any) => {
      console.log(error);
      if (error.response && error.response.data) {
        const { errors } = error.response.data;

        if (errors) {
          errors.forEach((err: { field: string; message: string }) => {
            form.setFields([
              {
                name: err.field,
                errors: [err.message],
              },
            ]);
          });
        } else if (error?.response?.status === 409) {
          error?.response?.data?.error === 'contact_phone_UNIQUE must be unique'
            ? message.error('Phone already exists.')
            : message.error('Email already exists.');
        } else {
          message.error('An unexpected error occurred.');
        }
      } else {
        message.error('An unexpected error occurred.');
      }
    },
  });

  // Delete company mutation
  const mutationDelete = useMutation({
    mutationFn: (companyId: number) =>
      deleteCompanyUser(companyId, dispatch, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyUser'] });
      message.success('Company user Updated successfully');
    },
  });
  const isDeleting = mutationDelete.status === 'pending';

  const handleRowClick = (record: User) => {
    setSelectedCompanyUser(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCompanyUser(null);
  };

  const handleDelete = (companyUser: User) => {
    mutationDelete.mutate(companyUser?.user_id);
    // console.log("companyUser",companyUser);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleAddModal = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };
  const handleAddCompany = async (values: any) => {
    // console.log('values', values);

    const companyUserData: AddCompanyUserRequest = {
      company_id: values.company_id,
      user_email: values.user_email,
      user_fname: values.user_fname,
      user_lname: values.user_lname,
    };

    try {
      await mutationAdd.mutateAsync(companyUserData);
    } catch (error: any) {
      console.log(error);

      if (error.response && error.response.data) {
        const { errors } = error.response.data;
        console.log(errors);
        if (errors) {
          errors.forEach((err: { field: string; message: string }) => {
            form.setFields([
              {
                name: err.field,
                errors: [err.message],
              },
            ]);
          });
        }
      }
    }
  };
  const handleUpdateCompany = async (values: any) => {
    // console.log('values', values);

    const companyUserData: AddCompanyUserRequest = {
      company_id: values.company_id,
      user_email: values.user_email,
      user_fname: values.user_fname,
      user_lname: values.user_lname,
    };

    try {
      if (selectedCompanyUser) {
        await mutationEdit.mutateAsync({
          ...companyUserData,
          user_id: selectedCompanyUser.user_id,
        });
      } else {
        await mutationAdd.mutateAsync(companyUserData);
      }
    } catch (error: any) {
      console.log(error);

      if (error.response && error.response.data) {
        const { errors } = error.response.data;
        console.log(errors);
        if (errors) {
          errors.forEach((err: { field: string; message: string }) => {
            form.setFields([
              {
                name: err.field,
                errors: [err.message],
              },
            ]);
          });
        }
      }
    }
  };

  const handleEdit = (companyUser: User) => {
    // console.log('companyUser', companyUser);

    setSelectedCompanyUser(companyUser);
    form.setFieldsValue({
      company_id: companyUser.company_id,
      user_fname: companyUser.user_fname,
      user_lname: companyUser.user_lname,
      user_email: companyUser.user_email,
    });
    setIsEditModalVisible(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'user_fname',
      key: 'user_fname',
    },
    {
      title: 'Last Name',
      dataIndex: 'user_lname',
      key: 'user_lname',
    },
    {
      title: 'Email',
      dataIndex: 'user_email',
      key: 'user_email',
    },
    {
      title: 'Company',
      dataIndex: ['companies', 'company_name'],
      key: 'company_name',
    },
    // {
    //   title: 'Phone',
    //   dataIndex:  ['companies', 'contact_phone'],
    //   key: 'contact_phone',
    // },
    // {
    //   title: 'Address',
    //   dataIndex: ['companies', 'office_address'],
    //   key: 'office_address',
    // },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: User) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(record)} className=" text-blue-500">
            <FaEdit className="text-xl" />
          </button>
          <Popconfirm
            title={`Are you sure you want to ${
              record.status ? 'deactivate' : 'activate'
            } this company user?`}
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            okButtonProps={{ className: 'bg-primary' }}
            cancelText="No"
          >
            <Switch
              checked={record.status}
              checkedChildren="A"
              unCheckedChildren="D"
              disabled={isDeleting}
              style={{
                backgroundColor: record.status ? '#008000' : '#EF4444', // Change colors dynamically
                borderColor: record.status ? '#008000' : '#EF4444',
              }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Profiles</h1>
      <div className="flex justify-between">
        <Input.Search
          placeholder="Search by First Name, Last Name, Email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            e.target.value === '' && setSearchTermValue('');
          }} // Update state as user types
          onSearch={(value) => setSearchTermValue(value)}
          enterButton={
            <Button style={{ backgroundColor: '#FD8232', color: '#fff' }}>
              <FaSearch />
            </Button>
          }
          style={{ marginBottom: '16px', maxWidth: '300px' }}
        />
        <Button className="bg-primary text-white" onClick={handleAddModal}>
          Add New Customer
        </Button>
      </div>
      <Table
        dataSource={customerData?.result?.data}
        columns={columns}
        rowKey="user_id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: customerData?.result?.length,
          onChange: (page) => setPage(page),
          className: 'custom-pagination',
          showLessItems: true,
        }}
      />

      {/* for handleRowClick */}
      {selectedCompanyUser && (
        <Modal
          title={`Customer Profile - ${
            selectedCompanyUser.user_fname + selectedCompanyUser.user_lname
          }`}
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" onClick={handleCloseModal}>
              Close
            </Button>,
          ]}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Customer Information</h2>
            <p>
              <strong>Email:</strong> {selectedCompanyUser.user_email}
            </p>
            {/* <p><strong>Phone:</strong> {selectedCompanyUser.}</p>
            <p><strong>Address:</strong> {selectedCompanyUser}</p> */}
          </div>
        </Modal>
      )}

      {selectedCompanyUser && (
        <Modal
          title={`Edit Customer`}
          open={isEditModalVisible}
          onCancel={handleEditModalCancel}
          footer={null}
          // footer={[
          //   <Button key="cancel" onClick={handleEditModalCancel}>
          //     Cancel
          //   </Button>,
          //   <Button
          //     key="submit"
          //     type="primary"
          //     onClick={handleAddOrUpdateCompany}
          //     className='bg-primary text-white'
          //   >
          //     Update
          //   </Button>,
          // ]}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateCompany}
            initialValues={{
              status: true, // Set initial value for status to true
            }}
          >
            <Form.Item
              label="First Name"
              name="user_fname"
              rules={[
                { required: true, message: 'Please input the customer name!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="user_lname"
              rules={[
                { required: true, message: 'Please input the customer name!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="user_email"
              rules={[
                { required: true, message: 'Please input the email!' },
                { type: 'email', message: 'Please input a valid email!' },
              ]}
            >
              <Input />
            </Form.Item>

            {/* <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please input the phone number!' },{
                pattern: /^\d{10}$/,
                message: 'Phone number must be 10 digits',
              },]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please input the address!' }]}
            >
              <Input />
            </Form.Item> */}

            <Form.Item
              label="Company"
              name="company_id" // Change to match the value in initialValues
              rules={[
                { required: true, message: 'Please select the company!' },
              ]}
            >
              <Select>
                {companiesData?.map((company) => (
                  <Select.Option
                    key={company.company_id}
                    value={company.company_id}
                  >
                    {company.company_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end">
                <Button
                  className="bg-danger text-white mr-2"
                  onClick={handleEditModalCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary text-white"
                  htmlType="submit"
                  loading={mutationEdit.status === 'pending'}
                  disabled={mutationEdit.status === 'pending'}
                >
                  Update
                  {mutationEdit.status === 'pending' ? <Spin /> : null}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      )}

      <Modal
        title="Add New Customer"
        open={isAddModalVisible}
        onCancel={handleAddModalCancel}
        footer={null}
        // footer={[
        //   <Button key="cancel" onClick={handleAddModalCancel}>
        //     Cancel
        //   </Button>,
        //   <Button key="submit" type="primary" onClick={handleAddOrUpdateCompany} className='bg-primary text-white'>
        //     Add
        //   </Button>,
        // ]}
      >
        <Form form={form} onFinish={handleAddCompany} layout="vertical">
          <Form.Item
            label="First Name"
            name="user_fname"
            rules={[
              {
                required: true,
                message: 'Please input the customer first name!',
              },
              {
                max: 255,
                message:
                  'Customer first name exceeds the maximum allowed length',
              },
              { pattern: /\S/, message: 'first name cannot be only spaces' },
              {
                validator: (_, value) => {
                  if (value && value.trim() !== value) {
                    return Promise.reject(
                      new Error(
                        'The input should not have leading or trailing spaces.',
                      ),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="user_lname"
            rules={[
              {
                required: true,
                message: 'Please input the customer last name!',
              },
              {
                max: 255,
                message:
                  'Customer last name exceeds the maximum allowed length',
              },
              { pattern: /\S/, message: 'last name cannot be only spaces' },
              {
                validator: (_, value) => {
                  if (value && value.trim() !== value) {
                    return Promise.reject(
                      new Error(
                        'The input should not have leading or trailing spaces.',
                      ),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="user_email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please input a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>

          {/* <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input the address!' }]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item
            label="Company"
            name="company_id" // Change to match the value in initialValues
            rules={[{ required: true, message: 'Please select the company!' }]}
          >
            <Select>
              {companiesData?.map((company) => (
                <Select.Option
                  key={company.company_id}
                  value={company.company_id}
                >
                  {company.company_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end">
              <Button
                className="bg-danger text-white mr-2"
                onClick={handleAddModalCancel}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary text-white"
                htmlType="submit"
                loading={mutationAdd.status === 'pending'}
                disabled={mutationAdd.status === 'pending'}
              >
                Add
                {mutationAdd.status === 'pending' ? <Spin /> : null}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerProfilePage;
