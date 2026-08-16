import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { AgendaScreen } from '../src/components/AgendaScreen';
import type { AgendaItem } from '../src/agenda/types';

const sampleItems: AgendaItem[] = [
  {
    id: '1',
    title: 'Morning walk among the blooms',
    startsAt: '2026-08-16T08:30:00.000Z',
    done: false,
  },
  {
    id: '2',
    title: 'Sketch garden notes',
    startsAt: '2026-08-16T11:00:00.000Z',
    done: false,
  },
];

const defaultProps = {
  items: sampleItems,
  dayIso: '2026-08-16T12:00:00.000Z',
  onBack: () => {},
  onToggleDone: () => {},
  onAddItem: () => {},
  onUpdateTime: () => {},
};

describe('AgendaScreen', () => {
  it('shows the floral agenda heading and day label', () => {
    render(<AgendaScreen {...defaultProps} />);

    expect(screen.getByText('Today’s bloom')).toBeTruthy();
    expect(screen.getByText(/August 16/)).toBeTruthy();
  });

  it('lists agenda items with titles', () => {
    render(<AgendaScreen {...defaultProps} />);

    expect(screen.getByText('Morning walk among the blooms')).toBeTruthy();
    expect(screen.getByText('Sketch garden notes')).toBeTruthy();
  });

  it('uses a floral background', () => {
    render(<AgendaScreen {...defaultProps} />);

    expect(screen.getByTestId('agenda-flowers-background')).toBeTruthy();
  });

  it('calls onBack when the back control is pressed', () => {
    const onBack = jest.fn();
    render(<AgendaScreen {...defaultProps} onBack={onBack} />);

    fireEvent.press(screen.getByRole('button', { name: /back to home/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('toggles an item when the petal control is pressed', () => {
    const onToggleDone = jest.fn();
    render(<AgendaScreen {...defaultProps} onToggleDone={onToggleDone} />);

    fireEvent.press(
      screen.getByRole('button', {
        name: /mark morning walk among the blooms done/i,
      }),
    );
    expect(onToggleDone).toHaveBeenCalledWith('1');
  });

  it('adds a new item from the compose field', () => {
    const onAddItem = jest.fn();
    render(<AgendaScreen {...defaultProps} onAddItem={onAddItem} />);

    fireEvent.changeText(
      screen.getByPlaceholderText(/plant a new plan/i),
      'Arrange peonies',
    );
    fireEvent.press(screen.getByRole('button', { name: /add to agenda/i }));
    expect(onAddItem).toHaveBeenCalledWith('Arrange peonies');
  });

  it('shows an empty garden message when there are no items', () => {
    render(<AgendaScreen {...defaultProps} items={[]} />);

    expect(
      screen.getByText(/your garden is quiet — plant a plan/i),
    ).toBeTruthy();
  });

  it('opens a time editor when a task time is pressed', () => {
    render(<AgendaScreen {...defaultProps} />);

    fireEvent.press(
      screen.getByRole('button', {
        name: /edit time for morning walk among the blooms/i,
      }),
    );

    expect(screen.getByText('Set bloom time')).toBeTruthy();
    expect(screen.getByTestId('agenda-time-picker')).toBeTruthy();
  });

  it('saves an edited time through onUpdateTime', () => {
    const onUpdateTime = jest.fn();
    render(<AgendaScreen {...defaultProps} onUpdateTime={onUpdateTime} />);

    fireEvent.press(
      screen.getByRole('button', {
        name: /edit time for morning walk among the blooms/i,
      }),
    );

    const picked = new Date(2000, 0, 1, 9, 15, 0, 0);
    fireEvent(
      screen.getByTestId('agenda-time-picker'),
      'onChange',
      { type: 'set' },
      picked,
    );
    fireEvent.press(screen.getByRole('button', { name: /save time/i }));

    expect(onUpdateTime).toHaveBeenCalledWith('1', '2026-08-16T09:15:00.000Z');
  });

  it('does not toggle done when the time control is pressed', () => {
    const onToggleDone = jest.fn();
    render(<AgendaScreen {...defaultProps} onToggleDone={onToggleDone} />);

    fireEvent.press(
      screen.getByRole('button', {
        name: /edit time for morning walk among the blooms/i,
      }),
    );

    expect(onToggleDone).not.toHaveBeenCalled();
  });

  it('does not open the time editor when marking a task done', () => {
    render(<AgendaScreen {...defaultProps} />);

    fireEvent.press(
      screen.getByRole('button', {
        name: /mark morning walk among the blooms done/i,
      }),
    );

    expect(screen.queryByText('Set bloom time')).toBeNull();
  });
});
