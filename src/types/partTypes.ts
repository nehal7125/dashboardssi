// Define the TypeScript types
export type PartType = {
  part_type_id: number;
  part_type_name: string;
  description: string;
  compatible_equipment_type: string;
  part_number: string;
  equipment_type_id: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type AddPartTypeRequest = {
  part_type_name: string;
  description: string;
  compatible_equipment_type: string;
  part_number: string;
  equipment_type_id: number;
};
