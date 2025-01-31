export type Inspector = {
        id: string,
        name: string,
        qualifications: string,
        schedule: string,
        performance: string,
      
  };

export type Assignment = {
    id: string,
    inspector: string,
    task: string,
    status: string,
    dueDate: string,
}

export type AddInspectorRequest = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role_id: number;
  status: boolean;
  password:string;
};