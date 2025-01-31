export type AddEquipmentTypeRequest = {
  equipment_type_name: string;
  description: string;
  standard: string;
  maintenance_interval: string;
};

export type AddEquipmentTypeResponse = {
  equipment_type_id: number;
  equipment_type_name: string;
  description: string;
  standard: string;
  maintenance_interval: string;
  status: boolean;
  created_at: string;
  updated_at: string;
};

export type EquipmentTypeListResponse = {
  success: boolean;
  result: {
    data: AddEquipmentTypeResponse[];
    length: number;
  };
};
