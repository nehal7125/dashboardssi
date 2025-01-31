import { render, screen, waitFor } from '@testing-library/react';
import CompanyDetailsPage from './CompanyDetails';
import * as reactQuery from '@tanstack/react-query'; // Import the whole module
import { Provider } from 'react-redux';
import { store } from '../../store';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new reactQuery.QueryClient();

// Use the importOriginal helper to keep other exports intact
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual, // Keep all actual exports intact
    useQuery: vi.fn(), // Mock the specific hook you need
  };
});

describe('CompanyDetailsPage - Get Companies', () => {
  const mockCompanyData = {
    result: {
      data: [
        {
          company_id: 1,
          company_name: 'Test Company',
          contact_email: 'test@test.com',
          contact_phone: '1234567890',
          office_address: '123 Main St',
          status: true,
          updated_at: '2024-01-01',
          created_at: '2023-01-01',
        },
      ],
      length: 1,
    },
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Mock the implementation of useQuery to return the mock data
    (reactQuery.useQuery as jest.Mock).mockImplementation(() => ({
      data: mockCompanyData,
      isLoading: false,
    }));
  });

  it('fetches and displays companies in the table', async () => {
    render(
      <Provider store={store}>
        <reactQuery.QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <CompanyDetailsPage />
          </BrowserRouter>
        </reactQuery.QueryClientProvider>
      </Provider>,
    );

    // Wait for the data to be fetched and displayed
    await waitFor(() => {
      // Check if the mock company data is rendered in the table
      expect(screen.getByText('Test Company')).toBeInTheDocument();
      expect(screen.getByText('test@test.com')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });
  });
});
