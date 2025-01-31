import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  message,
  InputNumber,
  Input,
} from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllInventory,
  addInventory,
  editInventory,
  getAllPartTypes,
} from '../../api/api';
import { PartType } from '../../types/partTypes';
import 'antd/dist/reset.css'; // Import AntD styles
import '../../css/customPagination.css';
import { useAppDispatch } from '../../store/hooks/index';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSearch } from 'react-icons/fa';

const { Option } = Select;

const InventoryPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermValue, setSearchTermValue] = useState('');
  const [selectedInventory, setSelectedInventory] = useState<any | null>(null);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //   const [partTypes, setPartTypes] = useState<PartType[]>([]);
  //   const [equipmentTypes, setEquipmentTypes] = useState<EquipmentTypeListResponse[]>([]);

  const queryClient = useQueryClient();

  const { data: inventoryData, isLoading } = useQuery({
    queryKey: ['inventory', page, limit, searchTermValue],
    queryFn: () => getAllInventory(page, limit,searchTermValue, dispatch,navigate),
    // select: (data) => {
    //   return Array.isArray(data.result.data) ? data.result.data : [];
    // },
  });
  useEffect(() => {
    setPage(1);
  }, [searchTermValue]);

  const { data: partTypesData } = useQuery({
    queryKey: ['partTypes'],
    queryFn: () => getAllPartTypes(dispatch,navigate), // Ensure this function fetches the part types
  });

  // Determine part types that are not in the current inventory
  const availablePartTypes =
    partTypesData?.result?.data.filter((partType: PartType) => {
      const isInInventory = inventoryData?.result?.data.some(
        (inventoryItem: any) =>
          inventoryItem.part_type_id === partType.part_type_id,
      );
      return !isInInventory;
    }) || [];

  //   const { data: equipmentTypesData } = useQuery({
  //     queryKey: ['equipmentTypes'],
  //     queryFn: () => getAllEquipmentTypes(), // Ensure this function fetches the equipment types
  //     onSuccess: (data) => setEquipmentTypes(data.result.data),
  //   });

  //   console.log(partTypesData);

  const mutationAdd = useMutation({
    mutationFn: (newInventory: { part_type_id: number; quantity: number }) =>
      addInventory(newInventory,dispatch,navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setIsModalVisible(false);
      message.success('Inventory Added successfully');
      form.resetFields();
    },
    onError: (error: any) => {
      if (error.response && error.response.data) {
        const { errors } = error.response.data;
        console.log(error);

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
        message.error(
          error?.response?.data?.error?.errno === 1062
            ? 'Inventory already exists.'
            : '',
        );
      } else {
        message.error('An unexpected error occurred.');
      }
    },
  });

  const mutationEdit = useMutation({
    mutationFn: (updatedInventory: {
      inventory_id: number;
      part_type_id: number;
      quantity: number;
    }) => editInventory(updatedInventory,dispatch,navigate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setIsModalVisible(false);
      setSelectedInventory(null);
      message.success('Inventory Updated successfully');
    },
    onError: (error: any) => {
      if (error.response && error.response.data) {
        const { errors } = error.response.data;
        console.log(error);

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
        message.error(
          error?.response?.data?.error?.errno === 1062
            ? 'Inventory already exists.'
            : '',
        );
      } else {
        message.error('An unexpected error occurred.');
      }
    },
  });

  const handleAddOrUpdateInventory = (values: any) => {
    const inventoryData = {
      part_type_id: values.part_type_id,
      quantity: values.quantity,
    };

    if (selectedInventory) {
      mutationEdit.mutate({
        ...inventoryData,
        inventory_id: selectedInventory.inventory_id,
      });
    } else {
      mutationAdd.mutate(inventoryData);
    }
  };

  const handleEdit = (inventory: any) => {
    setSelectedInventory(inventory);
    form.setFieldsValue({
      part_type_id: inventory.part_type_id,
      quantity: inventory.quantity,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedInventory(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Part Type',
      dataIndex: ['part_types', 'part_type_name'],
      key: 'part_type_name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Equipment Type',
      dataIndex: ['part_types', 'equipment_types', 'equipment_type_name'],
      key: 'equipment_type_name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <div>
          <button
            onClick={() => handleEdit(record)}
            className="mr-2 text-blue-500"
          >
            <FaEdit className='text-xl'/>
          </button>
          {/* <Popconfirm
            title={`Are you sure you want to delete this inventory item?`}
            onConfirm={() => handleDelete(record.inventory_id)} // Implement delete if needed
            okText="Yes"
            cancelText="No"
          >
            <Button className="bg-red-500 text-white">Delete</Button>
          </Popconfirm> */}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      <div className="flex justify-between">
      <Input.Search
          placeholder="Search by Part or Equipment type"
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
         <div></div>{/* Remove this line once above search input uncommented */}
        <Button
          onClick={() => setIsModalVisible(true)}
          className="mb-4 bg-primary text-white"
        >
          Add Inventory
        </Button>
      </div>
      <Table
        dataSource={inventoryData?.result.data}
        columns={columns}
        rowKey="inventory_id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: inventoryData?.result?.length,
          onChange: (page) => setPage(page),
          className: 'custom-pagination',
          showLessItems:true,
        }}
      />

      <Modal
        title={selectedInventory ? 'Edit Inventory' : 'Add New Inventory'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrUpdateInventory}
        >
          <Form.Item
            name="part_type_id"
            label="Part Type"
            rules={[{ required: true, message: 'Please select a part type' }]}
          >
            <Select
              placeholder="Select a part type"
              disabled={selectedInventory}
            >
              {selectedInventory
                ? partTypesData?.result?.data.map((partType: PartType) => (
                    <Option
                      key={partType.part_type_id}
                      value={partType.part_type_id}
                    >
                      {partType.part_type_name}
                    </Option>
                  ))
                : availablePartTypes.map((partType: PartType) => (
                    <Option
                      key={partType.part_type_id}
                      value={partType.part_type_id}
                    >
                      {partType.part_type_name}
                    </Option>
                  ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' },{
              type: 'number',
              min: 1,
              message: 'Quantity must be greater than zero',
            },
            ]}
          >
            <InputNumber className='w-full' min={0}/>
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
                {selectedInventory ? 'Update' : 'Add'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
