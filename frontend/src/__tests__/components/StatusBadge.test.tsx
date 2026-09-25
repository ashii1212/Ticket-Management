import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../../components/Badges';

describe('StatusBadge', () => {
  it('renders correct color class for each status', () => {
    const { rerender } = render(<StatusBadge status="NEW" />);
    expect(screen.getByText('New')).toHaveClass('bg-gray-100');

    rerender(<StatusBadge status="ASSIGNED" />);
    expect(screen.getByText('Assigned')).toHaveClass('bg-blue-100');

    rerender(<StatusBadge status="RESOLVED" />);
    expect(screen.getByText('Resolved')).toHaveClass('bg-green-100');
    
    rerender(<StatusBadge status="ESCALATED" />);
    expect(screen.getByText('Escalated')).toHaveClass('bg-red-100');
  });
});
