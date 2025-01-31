import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Spin, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addEquipmentType, deleteEquipmentType, editEquipmentType, getAllEquipmentTypes } from '../../api/api';
import { AddEquipmentTypeRequest } from '../../types/equipmentTypes';
import 'antd/dist/reset.css'; // Import AntD styles
import '../../css/customPagination.css';
import { FaEdit, FaSearch } from 'react-icons/fa';
import { useAppDispatch } from '../../store/hooks/index';
import { useNavigate } from 'react-router-dom';

// Define the TypeScript types
type EquipmentType = {
  equipment_type_id: number;
  equipment_type_name: string;
  description: string;
  standard: string;
  maintenance_interval: string;
  status: string;
  updated_at: string;
  created_at: string;
};

// EquipmentTypesPage Component
const EquipmentTypesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Set to 20 as per the example API
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<EquipmentType | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermValue, setSearchTermValue] = useState('');
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // Fetch equipment types data
  const { data, isLoading } = useQuery({
    queryKey: ['equipmentTypes', page, limit, searchTermValue],
    queryFn: () => getAllEquipmentTypes(page, limit, dispatch, navigate, searchTermValue),
  });
  useEffect(() => {
    setPage(1);
  }, [searchTermValue]);

  // Add equipment type mutation
  const mutationAdd = useMutation({
    mutationFn: (newEquipmentType: AddEquipmentTypeRequest) => addEquipmentType(newEquipmentType, dispatch, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipmentTypes'] });
      setIsModalVisible(false);
      message.success('Equipment Added successfully');
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
        }
        error?.response?.data?.error?.errno === 1062 &&
          message.error('Failed to add Equipment type. Equipment type already exists.');
      } else {
        message.error('An unexpected error occurred.');
      }
    },
  });

  // Edit equipment type mutation
  const mutationEdit = useMutation({
    mutationFn: (
      updatedEquipmentType: AddEquipmentTypeRequest & {
        equipment_type_id: number;
      },
    ) => editEquipmentType(updatedEquipmentType, dispatch, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipmentTypes'] });
      setIsModalVisible(false);
      setSelectedEquipmentType(null);
      message.success('Equipment Updated successfully');
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
        }
        error?.response?.data?.error?.errno === 1062 &&
          message.error('Failed to edit Equipment type. Equipment type already exists.');
      } else {
        message.error('An unexpected error occurred.');
      }
    },
  });

  // Delete equipment type mutation
  const mutationDelete = useMutation({
    mutationFn: (equipmentTypeId: number) => deleteEquipmentType(equipmentTypeId, dispatch, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipmentTypes'] });
      message.success('Equipment Updated successfully');
    },
  });

  const handleAddOrUpdateEquipmentType = (values: any) => {
    const equipmentTypeData: AddEquipmentTypeRequest & {
      equipment_type_id?: number;
    } = {
      equipment_type_name: values.equipment_type_name,
      description: values.description,
      standard: values.standard,
      maintenance_interval: values.maintenance_interval,
    };

    if (selectedEquipmentType) {
      mutationEdit.mutate({
        ...equipmentTypeData,
        equipment_type_id: selectedEquipmentType.equipment_type_id,
      });
    } else {
      mutationAdd.mutate(equipmentTypeData);
    }
    form.resetFields();
  };

  const handleEdit = (equipmentType: EquipmentType) => {
    setSelectedEquipmentType(equipmentType);
    form.setFieldsValue({
      equipment_type_name: equipmentType.equipment_type_name,
      description: equipmentType.description,
      standard: equipmentType.standard,
      maintenance_interval: equipmentType.maintenance_interval,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (equipmentTypeId: number) => {
    mutationDelete.mutate(equipmentTypeId);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedEquipmentType(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'equipment_type_name',
      key: 'equipment_type_name',
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Standard', dataIndex: 'standard', key: 'standard' },
    {
      title: 'Maintenance Interval',
      dataIndex: 'maintenance_interval',
      key: 'maintenance_interval',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (status ? 'Active' : 'Inactive'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: EquipmentType, record: EquipmentType) => (
        <div className="flex">
          <button onClick={() => handleEdit(record)} className="mr-2 text-blue-500">
            <FaEdit className="text-xl" />
          </button>
          {/* <br />
          <Popconfirm
            title={`Are you sure you want to ${
              record.status ? 'deactivate' : 'activate'
            } this equipment type?`}
            onConfirm={() => handleDelete(record.equipment_type_id)}
            okText="Yes"
            okButtonProps={{ className: 'bg-primary' }}
            cancelText="No"
          >
            <Switch
              checked={record.status}
              checkedChildren="A"
              unCheckedChildren="D"
              // className={`${record.status ? 'bg-green-700' : 'bg-red-500'}`}
              // className='bg-graydark'
              style={{
                backgroundColor: record.status ? '#008000' : '#EF4444', // Change colors dynamically
                borderColor: record.status ? '#008000' : '#EF4444',
              }}
            />
          </Popconfirm> */}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Equipment Types</h1>
      <div className="flex justify-between">
        <Input.Search
          placeholder="Search by Name or Description"
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
          Add Equipment Type
        </Button>
      </div>
      <Table
        dataSource={data?.result?.data}
        columns={columns}
        rowKey="id"
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
        title={selectedEquipmentType ? 'Edit Equipment Type' : 'Add New Equipment Type'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrUpdateEquipmentType}>
          <Form.Item
            name="equipment_type_name"
            label="Equipment Type Name"
            rules={[
              { required: true, message: 'Please enter equipment type name' },
              { pattern: /\S/, message: 'equipment type name cannot be only spaces' },
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
            name="description"
            label="Description"
            rules={[
              { required: true, message: 'Please enter description' },
              { pattern: /\S/, message: 'Description cannot be only spaces' },
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
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="standard"
            label="Standard"
            rules={[
              { required: true, message: 'Please enter standard' },
              { pattern: /\S/, message: 'standard cannot be only spaces' },
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
            name="maintenance_interval"
            label="Maintenance Interval"
            rules={[
              { required: true, message: 'Please enter maintenance interval' },
              { pattern: /\S/, message: 'maintenance interval cannot be only spaces' },
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
                {selectedEquipmentType ? 'Update' : 'Add'}
                {mutationAdd.status === 'pending' || mutationEdit.status === 'pending' ? <Spin /> : null}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EquipmentTypesPage;
