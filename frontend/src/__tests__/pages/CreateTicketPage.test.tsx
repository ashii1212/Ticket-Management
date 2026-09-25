import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { CreateTicketPage } from '../../pages/student/CreateTicketPage';
import { vi } from 'vitest';
import * as categoriesApi from '../../api/categories';
import * as ticketsApi from '../../api/tickets';

vi.mock('../../api/categories', () => ({
  getCategories: vi.fn().mockResolvedValue([{ id: 1, name: 'IT' }]),
}));
vi.mock('../../api/tickets', () => ({
  createTicket: vi.fn().mockResolvedValue({ id: 1 }),
}));

describe('CreateTicketPage', () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const renderComponent = () => render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CreateTicketPage />
      </QueryClientProvider>
    </BrowserRouter>
  );

  it('shows validation errors for empty fields', async () => {
    renderComponent();
    await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());
    
    const submitBtn = screen.getByRole('button', { name: /create ticket/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description must be at least/i)).toBeInTheDocument();
    });
  });

  it('shows validation errors for short description', async () => {
    renderComponent();
    await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());
    
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /create ticket/i }));

    await waitFor(() => {
      expect(screen.getByText(/description must be at least 20 characters/i)).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    renderComponent();
    await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());
    
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Valid Title' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'This is a long enough description to pass validation.' } });
    
    const submitBtn = screen.getByRole('button', { name: /create ticket/i });
    fireEvent.click(submitBtn);
    
    expect(submitBtn).toBeDisabled();
  });
});
