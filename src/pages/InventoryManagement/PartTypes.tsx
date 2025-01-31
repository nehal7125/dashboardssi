import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  Select,
  message,
} from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllPartTypes,
  addPartType,
  editPartType,
  deletePartType,
  getAllEquipmentTypes,
} from '../../api/api';
import { AddPartTypeRequest, PartType } from '../../types/partTypes';
import 'antd/dist/reset.css'; // Import AntD styles
import '../../css/customPagination.css';
import { useAppDispatch } from '../../store/hooks/index';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSearch } from 'react-icons/fa';

const PartTypesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermValue, setSearchTermValue] = useState('');
  const [selectedPartType, setSelectedPartType] = useState<PartType | null>(
    null,
  );
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['partTypes', page, limit, searchTermValue],
    queryFn: () => getAllPartTypes(dispatch,navigate,searchTermValue, page, limit),
  });
  useEffect(() => {
    setPage(1);
  }, [searchTermValue]);
  const { data: equipmentTypesData, isLoading: isEquipmentTypesLoading } =
    useQuery({
      queryKey: ['equipmentTypes'],
      queryFn: () => getAllEquipmentTypes(page, 30,dispatch,navigate), // Assume this fetches the equipment types
    });

    const filteredEquipmentTypeData = equipmentTypesData?.result?.data.filter(item => item.status === true);

  console.log(filteredEquipmentTypeData);

  const mutationAdd = useMutation({
    mutationFn: (newPartType: AddPartTypeRequest) => addPartType(newPartType,dispatch,navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partTypes'] });
      setIsModalVisible(false);
      message.success('Part type Added successfully');
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
          message.error('Failed to add Part type. Part type already exists.');
      } else {
        message.error('An unexpected error occurred.');
      }
    },
  });

  const mutationEdit = useMutation({
    mutationFn: (
      updatedPartType: AddPartTypeRequest & { part_type_id: number },
    ) => editPartType(updatedPartType,dispatch,navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partTypes'] });
      setIsModalVisible(false);
      setSelectedPartType(null);
      message.success('Part type Updated successfully');
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
          message.error('Failed to edit Part type. Part type already exists.');
      } else {
        message.error('An unexpected error occurred.');
      }
    },
  });

  const mutationDelete = useMutation({
    mutationFn: (partTypeId: number) => deletePartType(partTypeId,dispatch,navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partTypes'] });
      message.success('Part type Updated successfully');
    },
  });

  const handleAddOrUpdatePartType = (values: any) => {
    const partTypeData: AddPartTypeRequest & { part_type_id?: number } = {
      part_type_name: values.part_type_name,
      description: values.description,
      compatible_equipment_type: values.compatible_equipment_type,
      part_number: values.part_number,
      equipment_type_id: values.equipment_type_id,
    };

    if (selectedPartType) {
      mutationEdit.mutate({
        ...partTypeData,
        part_type_id: selectedPartType.part_type_id,
      });
    } else {
      mutationAdd.mutate(partTypeData);
    }
    form.resetFields();
  };

  const handleEdit = (partType: PartType) => {
    setSelectedPartType(partType);
    form.setFieldsValue({
      part_type_name: partType.part_type_name,
      description: partType.description,
      compatible_equipment_type: partType.compatible_equipment_type,
      part_number: partType.part_number,
      equipment_type_id: partType.equipment_type_id,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (partTypeId: number) => {
    mutationDelete.mutate(partTypeId);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPartType(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'part_type_name',
      key: 'part_type_name',
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Compatible Equipment Type',
      dataIndex: 'compatible_equipment_type',
      key: 'compatible_equipment_type',
    },
    { title: 'Part Number', dataIndex: 'part_number', key: 'part_number' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (status ? 'Active' : 'Inactive'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: PartType, record: PartType) => (
        <div>
          <button
            onClick={() => handleEdit(record)}
            className="mr-2 text-blue-500"
          >
            <FaEdit className='text-xl'/>
          </button>
          {/* <br/>
          <Popconfirm
            title={`Are you sure you want to ${
              record.status ? 'deactivate' : 'activate'
            } this part type?`}
            onConfirm={() => handleDelete(record.part_type_id)}
            okText="Yes"
            okButtonProps={{ className: 'bg-primary' }}
            cancelText="No"
          >
            <Button
              className={`${
                record.status ? 'bg-red-500' : 'bg-green-700'
              } text-white`}
            >
              {record.status ? 'Deactivate' : 'Activate'}
            </Button>
          </Popconfirm> */}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Part Types</h1>
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
        <Button
          onClick={() => setIsModalVisible(true)}
          className="mb-4 bg-primary text-white"
        >
          Add Part Type
        </Button>
      </div>
      <Table
        dataSource={data?.result?.data}
        columns={columns}
        rowKey="part_type_id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.result?.length,
          onChange: (page) => setPage(page),
          className: 'custom-pagination',
          showLessItems:true,
        }}
      />

      <Modal
        title={selectedPartType ? 'Edit Part Type' : 'Add New Part Type'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrUpdatePartType}
        >
          <Form.Item
            name="part_type_name"
            label="Part Type Name"
            rules={[
              { required: true, message: 'Please enter part type name' },
              { pattern: /\S/, message: 'part type name cannot be only spaces' },
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
            name="description"
            label="Description"
            rules={[
              { required: true, message: 'Please enter description' },
              { pattern: /\S/, message: 'Description cannot be only spaces' },
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
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="compatible_equipment_type"
            label="Compatible Equipment Type"
            rules={[
              {
                required: true,
                message: 'Please enter compatible equipment type',
              },
              { pattern: /\S/, message: 'equipment type cannot be only spaces' },
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
            name="part_number"
            label="Part Number"
            rules={[
              { required: true, message: 'Please enter part number' },
              { pattern: /\S/, message: 'part number cannot be only spaces' },
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
            name="equipment_type_id"
            label="Equipment Type"
            rules={[
              { required: true, message: 'Please select equipment type' },
            ]}
          >
            <Select
              loading={isEquipmentTypesLoading}
              placeholder="Select an equipment type"
              options={
                equipmentTypesData?.result?.data
                  ? filteredEquipmentTypeData.map((type: any) => ({
                      value: type.equipment_type_id,
                      label: type.equipment_type_name,
                    }))
                  : []
              }
            />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end">
              <Button
                className="bg-danger text-white mr-2"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary text-white"
                htmlType="submit"
                loading={
                  mutationAdd.status === 'pending' ||
                  mutationEdit.status === 'pending'
                }
              >
                {selectedPartType ? 'Update' : 'Add'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PartTypesPage;
