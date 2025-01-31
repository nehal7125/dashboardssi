import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Popconfirm, Spin, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AddInspectorRequest } from '../../types/Inspector';
import { addInspector, deleteInspector, editInspector, getAllInspectors } from '../../api/api';
import 'antd/dist/reset.css'; // Import AntD styles
import '../../css/customPagination.css';
import { useAppDispatch } from '../../store/hooks/index';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSearch } from 'react-icons/fa';

// Define the TypeScript types
type Inspector = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role_id: number;
  status: boolean;
  updated_at: string;
  created_at: string;
};

// InspectorProfilePage Component
const InspectorProfilePage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Set to 20 as per the example API
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermValue, setSearchTermValue] = useState('');
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // Fetch inspectors data
  const { data, isLoading } = useQuery({
    queryKey: ['inspectors', page, limit, searchTermValue],
    queryFn: () => getAllInspectors(page, limit, searchTermValue, dispatch, navigate),
    // keepPreviousData: true,
  });

  useEffect(() => {
    setPage(1);
  }, [searchTermValue]);

  // Add inspector mutation
  const mutationAdd = useMutation({
    mutationFn: (newInspector: AddInspectorRequest) => addInspector(newInspector, dispatch, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspectors'] });
      setIsModalVisible(false);
      message.success('Inspector Added successfully');
      form.resetFields();
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
          error?.response?.data?.error === 'phone_UNIQUE must be unique'
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

  // Edit inspector mutation
  const mutationEdit = useMutation({
    mutationFn: (updatedInspector: AddInspectorRequest & { id: number }) =>
      editInspector(updatedInspector, dispatch, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspectors'] });
      setIsModalVisible(false);
      setSelectedInspector(null);
      message.success('Inspector Updated successfully');
      form.resetFields();
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
          error?.response?.data?.error === 'phone_UNIQUE must be unique'
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

  // Delete inspector mutation
  const mutationDelete = useMutation({
    mutationFn: (inspectorId: number) => deleteInspector(inspectorId, dispatch, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspectors'] });
      message.success('Inspector Updated successfully');
    },
  });
  const isDeleting = mutationDelete.status === 'pending';

  const handleAddOrUpdateInspector = (values: any) => {
    const inspectorData: AddInspectorRequest & { id?: number } = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone,
      role_id: 3, // Assuming a fixed role_id for inspector
      status: values.status,
      password: '',
    };

    if (selectedInspector) {
      mutationEdit.mutate({
        ...inspectorData,
        id: selectedInspector.id,
      });
    } else {
      mutationAdd.mutate(inspectorData);
    }
    // form.resetFields();
  };

  const handleEdit = (inspector: Inspector) => {
    setSelectedInspector(inspector);
    form.setFieldsValue({
      first_name: inspector.first_name,
      last_name: inspector.last_name,
      email: inspector.email,
      phone: inspector.phone,
      status: inspector.status,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (inspectorId: number) => {
    mutationDelete.mutate(inspectorId);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedInspector(null);
    form.resetFields();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
    { title: 'Last Name', dataIndex: 'last_name', key: 'last_name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (status ? 'Active' : 'Inactive'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: Inspector, record: Inspector) => (
        <div className="flex">
          <button onClick={() => handleEdit(record)} className="mr-2 text-blue-500">
            <FaEdit className="text-xl" />
          </button>
          <Popconfirm
            title={`Are you sure you want to ${record.status ? 'deactivate' : 'activate'} this inspector?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            okButtonProps={{ className: 'bg-primary' }}
            cancelText="No"
          >
            <Switch
              checked={record.status}
              disabled={isDeleting}
              checkedChildren="A"
              unCheckedChildren="D"
              style={{
                backgroundColor: record.status ? '#008000' : '#EF4444',
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
      <h1 className="text-2xl font-bold mb-4">Inspector Profile</h1>
      <div className="flex justify-between">
        <Input.Search
          placeholder="Search by First/Last Name, Email, or Phone"
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

        <Button onClick={() => setIsModalVisible(true)} className="mb-4 bg-primary text-white">
          Add Inspector
        </Button>
      </div>
      <Table
        dataSource={data?.data}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.length,
          onChange: (page) => setPage(page),
          className: 'custom-pagination',
          showLessItems: true,
        }}
      />

      <Modal
        title={selectedInspector ? 'Edit Inspector' : 'Add New Inspector'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrUpdateInspector}
          initialValues={{
            status: true, // Set initial value for status to true
          }}
        >
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[
              { required: true, message: 'Please enter first name' },
              {
                max: 255,
                message: 'Company name exceeds the maximum allowed length',
              },
              { pattern: /\S/, message: 'first name cannot be only spaces' },
              {
                validator: (_, value) => {
                  if (value && value.trim() !== value) {
                    return Promise.reject(new Error('The input should not have leading or trailing spaces.'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[
              { required: true, message: 'Please enter last name' },
              {
                max: 255,
                message: 'Company name exceeds the maximum allowed length',
              },
              { pattern: /\S/, message: 'last name cannot be only spaces' },
              {
                validator: (_, value) => {
                  if (value && value.trim() !== value) {
                    return Promise.reject(new Error('The input should not have leading or trailing spaces.'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              {
                type: 'email',
                message: 'Please enter valid email',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: 'Please enter phone number' },
              {
                pattern: /^\d{10}$/,
                message: 'Phone number must be 10 digits',
              },
            ]}
          >
            <Input
              type="text"
              maxLength={10}
              onInput={(e) => {
                const input = e.target as HTMLInputElement; // Type assertion
                input.value = input.value.replace(/[^0-9]/g, ''); // Ensure only numbers
              }}
            />
          </Form.Item>

          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch className="bg-graydark" />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end">
              <Button className="bg-danger text-white mr-2" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                className="bg-primary text-white"
                htmlType="submit"
                loading={mutationAdd.status === 'pending' || mutationEdit.status === 'pending'}
                disabled={mutationAdd.status === 'pending' || mutationEdit.status === 'pending'}
              >
                {selectedInspector ? 'Update' : 'Add'}
                {mutationAdd.status === 'pending' || mutationEdit.status === 'pending' ? <Spin /> : null}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InspectorProfilePage;
