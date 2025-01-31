type Company = {
    company_id: number;
    company_name: string;
    contact_email: string;
    contact_phone: string;
    office_address: string;
    status: boolean;
    created_at: string;
    updated_at: string;
};

type User = {
    user_id: number;
    company_id: number;
    role_id: number;
    user_email: string;
    password: string;
    user_fname: string;
    user_lname: string;
    status: boolean;
    created_at: string;
    updated_at: string;
    preferred_timezone: string;
    companies: Company;
};

type userApiResponse = {
    success: boolean;
    result: {
        data: User[];
        length: number;
    };
};
