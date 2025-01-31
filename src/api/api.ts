import { AddEquipmentTypeRequest } from '../types/equipmentTypes';
import { AddInspectorRequest } from '../types/Inspector';
import { AddPartTypeRequest } from '../types/partTypes';
import axios from 'axios';
import { baseURL } from './https';
import { message } from 'antd';
import { signOut } from '../features/auth/authSlice';

// Define the types for the response data
interface Company {
  company_id: number;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  office_address: string;
  status: boolean;
  updated_at: string;
  created_at: string;
}
type AddCompanyUserRequest = {
  company_id: number;
  user_fname: string;
  user_lname: string;
  user_email: string;
};

type AddCompanyRequest = {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  office_address: string;
  status: boolean;
};

interface CompanyListResponse {
  success: boolean;
  result: {
    data: Company[];
    length: number;
  };
}

type AddCompanyResponse = {
  message: string;
  // Add any other properties from the response if needed
};

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken') || '';
  }
  return null;
};

const handleError = (error: any, dispatch: any, navigate: any) => {
  console.error('API Error:', error);
  if (error.response?.status === 401) {
    dispatch(signOut());
    navigate('/auth/signin');
    message.error('Session expired. Please sign in again.');
  } else {
    console.log(error.response?.data?.message || 'An error occurred');
  }
  throw error;
};

export const getAllCompanies = async (
  page?: number,
  limit?: number | string,
  searchText?: string,
  dispatch?: any,
  navigate?: any,
) => {
  try {
    const response = await axios.get<CompanyListResponse>(
      `${baseURL}/api/v1/companies`,
      {
        params: {
          page,
          limit,
          searchText, // Spread the optional filter parameters
        },
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const addCompany = async (
  companyData: AddCompanyRequest,
  dispatch: any,
  navigate: any,
) => {
  try {
    const response = await axios.post<AddCompanyResponse>(
      `${baseURL}/api/v1/companies`,
      companyData,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const editCompany = async (
  companyData: AddCompanyRequest & { company_id: number },
  dispatch: any,
  navigate: any,
) => {
  try {
    const response = await axios.put<AddCompanyResponse>(
      `${baseURL}/api/v1/companies/${companyData.company_id}`,
      companyData,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const deleteCompany = async (
  companyId: number,
  dispatch: any,
  navigate: any,
): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/api/v1/companies/${companyId}`, {
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

// Company users API
export const getAllCompanyUsers = async (
  page?: number,
  limit?: number,
  searchText?: string,
  dispatch?: any,
  navigate?: any,
) => {
  try {
    const response = await axios.get<userApiResponse>(
      `${baseURL}/api/v1/company/users`,
      {
        params: {
          page,
          limit,
          searchText,
        },
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const addCompanyUser = async (
  companyUserData: AddCompanyUserRequest,
  dispatch: any,
  navigate: any,
) => {
  try {
    const response = await axios.post<AddCompanyResponse>(
      `${baseURL}/api/v1/company/users`,
      companyUserData,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const editCompanyUser = async (
  companyUserData: AddCompanyUserRequest & { user_id: number },
  dispatch: any,
  navigate: any,
) => {
  try {
    const response = await axios.put<AddCompanyResponse>(
      `${baseURL}/api/v1/company/users/${companyUserData.user_id}`,
      companyUserData,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const deleteCompanyUser = async (
  companyUserId: number,
  dispatch: any,
  navigate: any,
): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/api/v1/company/users/${companyUserId}`, {
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

// Inspectors API Functions
export const getAllInspectors = async (
  page: number = 1,
  limit: number = 20,
  searchText?: string,
  dispatch?: any,
  navigate?: any,
) => {
  try {
    const response = await axios.get(`${baseURL}/api/v1/inspector`, {
      params: { page, limit, searchText },
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data.result;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const addInspector = async (
  newInspector: AddInspectorRequest,
  dispatch: any,
  navigate: any,
) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/v1/inspector`,
      newInspector,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const editInspector = async (
  updatedInspector: AddInspectorRequest & { id: number },
  dispatch: any,
  navigate: any,
) => {
  try {
    const response = await axios.put(
      `${baseURL}/api/v1/inspector/${updatedInspector.id}`,
      updatedInspector,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const deleteInspector = async (
  inspectorId: number,
  dispatch: any,
  navigate: any,
): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/api/v1/inspector/${inspectorId}`, {
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

// Equipment Types API Functions
export const getAllEquipmentTypes = async (
  page: number = 1,
  limit: number = 20,
  dispatch?: any,
  navigate?: any,
  searchText?: string,
) => {
  try {
    const response = await axios.get(`${baseURL}/api/v1/equipmentTypes`, {
      params: { page, limit, searchText },
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data; // Ensure that response.data matches the EquipmentTypeListResponse type
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const addEquipmentType = async (
  equipmentTypeData: AddEquipmentTypeRequest,
  dispatch: any,
  navigate: any,
) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/v1/equipmentTypes`,
      equipmentTypeData,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const editEquipmentType = async (
  equipmentTypeData: AddEquipmentTypeRequest & { equipment_type_id: number },
  dispatch: any,
  navigate: any,
) => {
  try {
    const response = await axios.put(
      `${baseURL}/api/v1/equipmentTypes/${equipmentTypeData.equipment_type_id}`,
      equipmentTypeData,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const deleteEquipmentType = async (
  equipmentTypeId: number,
  dispatch: any,
  navigate: any,
) => {
  try {
    await axios.delete(`${baseURL}/api/v1/equipmentTypes/${equipmentTypeId}`, {
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

// Part Types API Functions
export const getAllPartTypes = async (
  dispatch: any,
  navigate: any,
  searchText?: string,
  page?: number, // Optional with "?"
  limit?: number, // Optional with "?"
) => {
  // Assign default values within the function body
  const currentPage = page ?? 1;
  const currentLimit = limit ?? 20;

  try {
    const response = await axios.get(`${baseURL}/api/v1/partTypes`, {
      params: { page: currentPage, limit: currentLimit, searchText },
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data; // Ensure that response.data matches the PartTypeListResponse type
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const addPartType = async (
  partTypeData: AddPartTypeRequest,
  dispatch: any,
  navigate: any,
) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/v1/partTypes`,
      partTypeData,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const editPartType = async (
  partTypeData: AddPartTypeRequest & { part_type_id: number },
  dispatch: any,
  navigate: any,
) => {
  try {
    const response = await axios.put(
      `${baseURL}/api/v1/partTypes/${partTypeData.part_type_id}`,
      partTypeData,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const deletePartType = async (
  partTypeId: number,
  dispatch: any,
  navigate: any,
) => {
  try {
    await axios.delete(`${baseURL}/api/v1/partTypes/${partTypeId}`, {
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

// Inventory API Functions
export const getAllInventory = async (
  page: number = 1,
  limit: number = 20,
  searchText: string,
  dispatch: any,
  navigate: any,
) => {
  try {
    const response = await axios.get(`${baseURL}/api/v1/inventory`, {
      params: { page, limit, searchText },
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data; // Ensure that response.data matches the InventoryListResponse type
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const addInventory = async (
  inventoryData: any,
  dispatch: any,
  navigate: any,
) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/v1/inventory`,
      inventoryData,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const editInventory = async (
  inventoryData: any & { inventory_id: number },
  dispatch: any,
  navigate: any,
) => {
  try {
    const response = await axios.put(
      `${baseURL}/api/v1/inventory/${inventoryData.inventory_id}`,
      inventoryData,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};

export const deleteInventory = async (
  inventoryId: number,
  dispatch: any,
  navigate: any,
) => {
  try {
    await axios.delete(`${baseURL}/api/v1/inventory/${inventoryId}`, {
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};
