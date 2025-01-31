import React, { useState } from 'react';
import { Modal, Button, Table, Form, Input, message, Select } from 'antd';
import { FaEdit, FaEye } from 'react-icons/fa'; // Importing the 'eye' icon for view action
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Equipment = {
  _id: string;
  equipment_id: string;
  name: string;
  category: string;
  location: string;
  status: string;
  last_inspection: string;
  next_due: string;
  notes: string;
};

type AddEquipmentRequest = {
  equipment_id: string;
  name: string;
  category: string;
  location: string;
  status: string;
  last_inspection: string;
  next_due: string;
  notes: string;
};

const EquipmentPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false); // State for view modal
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch equipment data
  const { data: equipmentData, isLoading } = useQuery({
    queryKey: ['equipment', page, limit],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/api/equipment?page=${page}&limit=${limit}`);
      console.log(response.data);
      return response.data;
    },
  });

  // Add equipment mutation
  const mutationAdd = useMutation({
    mutationFn: async (newEquipment: AddEquipmentRequest) => {
      const response = await axios.post('http://localhost:5000/api/equipment', newEquipment);
      console.log(response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setIsAddModalVisible(false);
      message.success('Equipment added successfully');
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'An error occurred while adding the equipment.');
    },
  });

  // Update equipment mutation
  const mutationUpdate = useMutation({
    mutationFn: async (updatedEquipment: Equipment) => {
      const response = await axios.put(`http://localhost:5000/api/equipment/${updatedEquipment._id}`, updatedEquipment);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setIsAddModalVisible(false);
      message.success('Equipment updated successfully');
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'An error occurred while updating the equipment.');
    },
  });

  // Delete equipment mutation
  // const mutationDelete = useMutation({
  //   mutationFn: async (id: string) => {
  //     const response = await axios.delete(`http://localhost:5000/api/equipment/${id}`);
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['equipment'] });
  //     message.success('Equipment deleted successfully');
  //   },
  //   onError: (error: any) => {
  //     message.error(error.response?.data?.message || 'An error occurred while deleting the equipment.');
  //   },
  // });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'equipment_id',
      key: 'equipment_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Last Inspection',
      dataIndex: 'last_inspection',
      key: 'last_inspection',
    },
    {
      title: 'Next Due',
      dataIndex: 'next_due',
      key: 'next_due',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: Equipment) => (
        <div className="flex space-x-2">
          <button onClick={() => handleView(record)} className="text-green-500">
            <FaEye className="text-xl" />
          </button>
          <button onClick={() => handleEdit(record)} className="text-blue-500">
            <FaEdit className="text-xl" />
          </button>
          {/* <button onClick={() => mutationDelete.mutate(record._id)} className="text-red-500">
            Delete
          </button> */}
        </div>
      ),
    },
  ];
  const handleAddModal = () => {
    form.resetFields();
    setIsAddModalVisible(true);
    setSelectedEquipment(null);
  };

  const handleEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    form.setFieldsValue(equipment);
    setIsAddModalVisible(true);
  };

  const handleView = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsViewModalVisible(true); // Open view modal
  };

  const handleFormSubmit = async (values: AddEquipmentRequest) => {
    if (selectedEquipment) {
      await mutationUpdate.mutateAsync({ ...values, _id: selectedEquipment._id });
    } else {
      await mutationAdd.mutateAsync(values);
    }
  };

  // Handle Modal Cancel
  const handleModalCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields();
  };

  // Handle View Modal Cancel
  const handleViewModalCancel = () => {
    setIsViewModalVisible(false);
    setSelectedEquipment(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Equipment Details</h1>
      <div className="flex justify-between">
        <Input.Search
          placeholder="Search by Equipment Name, Category, Location"
          style={{ marginBottom: '16px', maxWidth: '300px' }}
          onSearch={(value) => {}}
        />
        {/* <Button className="bg-primary text-white" onClick={handleAddModal}>
          View Access of Equipment Management
        </Button> */}
      </div>
      <Table
        dataSource={equipmentData?.data}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: equipmentData?.total,
          onChange: (page, pageSize) => {
            setPage(page);
            setLimit(pageSize);
          },
        }}
      />

      <Modal
        title={selectedEquipment ? 'Edit Equipment' : 'Add New Equipment'}
        visible={isAddModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item
            label="Equipment ID"
            name="equipment_id"
            rules={[{ required: true, message: 'Please input the  ID!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the Equipment Name!' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please input the Equipment Category!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: 'Please input the Equipment Location!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select the Status!' }]}>
            <Select>
              <Select.Option value="OK">OK</Select.Option>
              <Select.Option value="Needs Inspection">Needs Inspection</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Last Inspection"
            name="last_inspection"
            rules={[{ required: true, message: 'Please input the Last Inspection Date!' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Next Due"
            name="next_due"
            rules={[{ required: true, message: 'Please input the Next Due Date!' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Notes" name="notes">
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end">
              <Button className="bg-danger text-white mr-2" onClick={handleModalCancel}>
                Cancel
              </Button>
              <Button
                className="bg-primary text-white"
                htmlType="submit"
                loading={mutationAdd.isLoading || mutationUpdate.isLoading}
              >
                {selectedEquipment ? 'Update' : 'Save'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Viewing Equipment */}
      <Modal title="View Equipment" visible={isViewModalVisible} onCancel={handleViewModalCancel} footer={null}>
        {selectedEquipment && (
          <div>
            <p>
              <strong>Equipment ID:</strong> {selectedEquipment.equipment_id}
            </p>
            <p>
              <strong>Name:</strong> {selectedEquipment.name}
            </p>
            <p>
              <strong>Category:</strong> {selectedEquipment.category}
            </p>
            <p>
              <strong>Location:</strong> {selectedEquipment.location}
            </p>
            <p>
              <strong>Status:</strong> {selectedEquipment.status}
            </p>
            <p>
              <strong>Last Inspection:</strong> {selectedEquipment.last_inspection}
            </p>
            <p>
              <strong>Next Due:</strong> {selectedEquipment.next_due}
            </p>
            <p>
              <strong>Notes:</strong> {selectedEquipment.notes}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EquipmentPage;
