import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { CompletedSummaryScreen } from '../src/components/CompletedSummaryScreen';
import type { AgendaItem } from '../src/agenda/types';

const completedItems: AgendaItem[] = [
  {
    id: '1',
    title: 'Morning walk among the blooms',
    startsAt: '2026-08-16T08:30:00.000Z',
    done: true,
  },
  {
    id: '2',
    title: 'Sketch garden notes',
    startsAt: '2026-08-16T11:00:00.000Z',
    done: true,
  },
];

const defaultProps = {
  items: completedItems,
  timeZoneMode: 'utc' as const,
  onBack: () => {},
};

describe('CompletedSummaryScreen', () => {
  it('shows a floral completed summary heading and count', () => {
    render(<CompletedSummaryScreen {...defaultProps} />);

    expect(screen.getByText('Completed blooms')).toBeTruthy();
    expect(screen.getByText(/2 completed/i)).toBeTruthy();
  });

  it('lists only completed task titles with times', () => {
    render(<CompletedSummaryScreen {...defaultProps} />);

    expect(screen.getByText('Morning walk among the blooms')).toBeTruthy();
    expect(screen.getByText('Sketch garden notes')).toBeTruthy();
    expect(screen.getByText(/8:30/)).toBeTruthy();
    expect(screen.getByText(/11:00/)).toBeTruthy();
  });

  it('uses a floral background', () => {
    render(<CompletedSummaryScreen {...defaultProps} />);

    expect(screen.getByTestId('completed-flowers-background')).toBeTruthy();
  });

  it('shows an empty state when nothing is completed', () => {
    render(<CompletedSummaryScreen items={[]} onBack={() => {}} />);

    expect(screen.getByText(/no blooms completed yet/i)).toBeTruthy();
  });

  it('calls onBack when the back control is pressed', () => {
    const onBack = jest.fn();
    render(<CompletedSummaryScreen {...defaultProps} onBack={onBack} />);

    fireEvent.press(screen.getByRole('button', { name: /back to home/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
