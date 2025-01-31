export type Customer = 
    {
        id: string,
        name: string,
        email: string,
        phone: string,
        address: string,
        serviceHistory?: [
          { date: string, service: string, details: string },
          // Add more service history items as needed
        ],
        contracts?: [
          { contractId: string, startDate: string, endDate: string, status: string },
          // Add more contracts as needed
        ],
        company_id:string | number;
      
  };