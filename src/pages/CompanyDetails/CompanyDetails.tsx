import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Popconfirm, Spin } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllCompanies, addCompany, editCompany, deleteCompany } from '../../api/api';
import 'antd/dist/reset.css'; // Import AntD styles
import '../../css/customPagination.css';
import { message } from 'antd';
import { useAppDispatch } from '../../store/hooks/index';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSearch } from 'react-icons/fa';

// Define the TypeScript types
type Company = {
  company_id: number;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  office_address: string;
  status: boolean;
  updated_at: string;
  created_at: string;
};

type AddCompanyRequest = {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  office_address: string;
  status: boolean;
};

const CompanyDetailsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermValue, setSearchTermValue] = useState('');
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // Fetch companies data
  const { data, isLoading } = useQuery({
    queryKey: ['companies', page, limit, searchTermValue],
    queryFn: () => getAllCompanies(page, limit, searchTermValue, dispatch, navigate),
    // keepPreviousData: true,
  });

  useEffect(() => {
    setPage(1);
  }, [searchTermValue]);

  // Add company mutation
  const mutationAdd = useMutation({
    mutationFn: (newCompany: AddCompanyRequest) => addCompany(newCompany, dispatch, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsModalVisible(false);
      message.success('Company Added successfully');
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
    mutationFn: (updatedCompany: AddCompanyRequest & { company_id: number }) =>
      editCompany(updatedCompany, dispatch, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsModalVisible(false);
      setSelectedCompany(null);
      message.success('Company Updated successfully');
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
    mutationFn: (companyId: number) => deleteCompany(companyId, dispatch, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      message.success('Company Updated successfully');
    },
  });
  const isDeleting = mutationDelete.status === 'pending';

  const handleAddOrUpdateCompany = async (values: any) => {
    const companyData: AddCompanyRequest & { company_id?: number } = {
      company_name: values.company_name,
      contact_email: values.contact_email,
      contact_phone: values.contact_phone,
      office_address: values.office_address,
      status: values.status,
    };

    try {
      if (selectedCompany) {
        await mutationEdit.mutateAsync({
          ...companyData,
          company_id: selectedCompany.company_id,
        });
      } else {
        await mutationAdd.mutateAsync(companyData);
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

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    form.setFieldsValue({
      company_name: company.company_name,
      contact_email: company.contact_email,
      contact_phone: company.contact_phone,
      office_address: company.office_address,
      status: company.status,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (companyId: number) => {
    mutationDelete.mutate(companyId);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedCompany(null);
    form.resetFields();
  };

  const columns = [
    { title: 'ID', dataIndex: 'company_id', key: 'company_id' },
    { title: 'Name', dataIndex: 'company_name', key: 'company_name' },
    { title: 'Email', dataIndex: 'contact_email', key: 'contact_email' },
    { title: 'Phone', dataIndex: 'contact_phone', key: 'contact_phone' },
    {
      title: 'Office Address',
      dataIndex: 'office_address',
      key: 'office_address',
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (status: boolean) => (status ? 'Active' : 'Inactive'),
    // },
    // {
    //   title: 'Created At',
    //   dataIndex: 'created_at',
    //   key: 'created_at',
    //   render: (createdAt: string) => {
    //     const preferredTimezone =
    //       localStorage.getItem('preferred_timezone') || 'UTC'; // Default to UTC
    //     const zonedDate = toZonedTime(new Date(createdAt), preferredTimezone);
    //     return format(zonedDate, 'yyyy-MM-dd', { timeZone: preferredTimezone });
    //   },
    // },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: Company, record: Company) => (
        <div className="flex">
          <button onClick={() => handleEdit(record)} className="mr-2 text-blue-500">
            <FaEdit className="text-xl" />
          </button>
          {/* <br /> */}

          <Popconfirm
            title={`Are you sure you want to ${record.status ? 'deactivate' : 'activate'} this company?`}
            onConfirm={() => handleDelete(record.company_id)}
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
      <h1 className="text-2xl font-bold mb-4">Company Details</h1>
      <div className="flex justify-between">
        <Input.Search
          placeholder="Search by Name, Email, or Phone"
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
          Add Company
        </Button>
      </div>

      <Table
        dataSource={data?.result?.data}
        columns={columns}
        rowKey="company_id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.result?.length,
          onChange: (page) => setPage(page),
          className: 'custom-pagination',
          showLessItems: true,
        }}
      />

      <Modal
        title={selectedCompany ? 'Edit Company' : 'Add New Company'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrUpdateCompany}
          initialValues={{
            status: true, // Set initial value for status to true
          }}
        >
          <Form.Item
            name="company_name"
            label="Company Name"
            rules={[
              { required: true, message: 'Please enter company name' },
              {
                max: 255,
                message: 'Company name exceeds the maximum allowed length',
              },
              { pattern: /\S/, message: 'Company name cannot be only spaces' },
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
            name="contact_email"
            label="Contact Email"
            rules={[
              { required: true, message: 'Please enter contact email' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contact_phone"
            label="Contact Phone"
            rules={[
              { required: true, message: 'Please enter contact phone' },
              {
                pattern: /^\d{10}$/,
                message: 'Contact phone must be 10 digits',
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
          <Form.Item
            name="office_address"
            label="Office Address"
            rules={[
              { required: true, message: 'Please enter office address' },
              { pattern: /\S/, message: 'Office address cannot be only spaces' },
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
                {selectedCompany ? 'Update' : 'Add'}
                {mutationAdd.status === 'pending' || mutationEdit.status === 'pending' ? <Spin /> : null}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CompanyDetailsPage;
