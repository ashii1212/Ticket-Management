import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';

describe('TicketList States', () => {
  it('renders loading state', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders empty state when no tickets', () => {
    render(<EmptyState title="No tickets" message="You have no tickets" />);
    expect(screen.getByText('No tickets')).toBeInTheDocument();
    expect(screen.getByText('You have no tickets')).toBeInTheDocument();
  });
});
