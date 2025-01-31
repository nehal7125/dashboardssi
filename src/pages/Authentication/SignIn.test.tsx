import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import SignIn from './SignIn';
import '@testing-library/jest-dom';
import { store } from '../../store';

describe('SignIn Component', () => {
  it('should render the SignIn form correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </Provider>
    );

    // Check if the logo is rendered
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();

    // Check if the form fields and buttons are rendered
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/6\+ characters, 1 capital letter/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
  })

  it('should show an error message if the form is submitted with empty fields', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </Provider>
    );

    // Click the Sign In button without filling in the fields
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    // Expect error messages to appear (you might want to check specific validation messages)
    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).toBeInTheDocument();
      expect(screen.queryByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should call the API and handle success', async () => {
    // Mock API call
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({
        access_token: 'test-token',
        result: { "name": "Super Admin", "role_name": "Admin" },
      }),
    } as any);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </Provider>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'admin@mailinator.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/6\+ characters, 1 capital letter/i), {
      target: { value: 'Test@123' },
    });

    // Click the Sign In button
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Expect API call and success message
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
    // Clear the mock
    vi.restoreAllMocks();
  });
});