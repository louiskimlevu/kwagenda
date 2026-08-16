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

describe('AgendaScreen', () => {
  it('shows the floral agenda heading and day label', () => {
    render(
      <AgendaScreen
        items={sampleItems}
        dayIso="2026-08-16T12:00:00.000Z"
        onBack={() => {}}
        onToggleDone={() => {}}
        onAddItem={() => {}}
      />,
    );

    expect(screen.getByText('Today’s bloom')).toBeTruthy();
    expect(screen.getByText(/August 16/)).toBeTruthy();
  });

  it('lists agenda items with titles', () => {
    render(
      <AgendaScreen
        items={sampleItems}
        dayIso="2026-08-16T12:00:00.000Z"
        onBack={() => {}}
        onToggleDone={() => {}}
        onAddItem={() => {}}
      />,
    );

    expect(screen.getByText('Morning walk among the blooms')).toBeTruthy();
    expect(screen.getByText('Sketch garden notes')).toBeTruthy();
  });

  it('uses a floral background', () => {
    render(
      <AgendaScreen
        items={sampleItems}
        dayIso="2026-08-16T12:00:00.000Z"
        onBack={() => {}}
        onToggleDone={() => {}}
        onAddItem={() => {}}
      />,
    );

    expect(screen.getByTestId('agenda-flowers-background')).toBeTruthy();
  });

  it('calls onBack when the back control is pressed', () => {
    const onBack = jest.fn();
    render(
      <AgendaScreen
        items={sampleItems}
        dayIso="2026-08-16T12:00:00.000Z"
        onBack={onBack}
        onToggleDone={() => {}}
        onAddItem={() => {}}
      />,
    );

    fireEvent.press(screen.getByRole('button', { name: /back to home/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('toggles an item when pressed', () => {
    const onToggleDone = jest.fn();
    render(
      <AgendaScreen
        items={sampleItems}
        dayIso="2026-08-16T12:00:00.000Z"
        onBack={() => {}}
        onToggleDone={onToggleDone}
        onAddItem={() => {}}
      />,
    );

    fireEvent.press(
      screen.getByRole('button', {
        name: /morning walk among the blooms/i,
      }),
    );
    expect(onToggleDone).toHaveBeenCalledWith('1');
  });

  it('adds a new item from the compose field', () => {
    const onAddItem = jest.fn();
    render(
      <AgendaScreen
        items={sampleItems}
        dayIso="2026-08-16T12:00:00.000Z"
        onBack={() => {}}
        onToggleDone={() => {}}
        onAddItem={onAddItem}
      />,
    );

    fireEvent.changeText(
      screen.getByPlaceholderText(/plant a new plan/i),
      'Arrange peonies',
    );
    fireEvent.press(screen.getByRole('button', { name: /add to agenda/i }));
    expect(onAddItem).toHaveBeenCalledWith('Arrange peonies');
  });

  it('shows an empty garden message when there are no items', () => {
    render(
      <AgendaScreen
        items={[]}
        dayIso="2026-08-16T12:00:00.000Z"
        onBack={() => {}}
        onToggleDone={() => {}}
        onAddItem={() => {}}
      />,
    );

    expect(
      screen.getByText(/your garden is quiet — plant a plan/i),
    ).toBeTruthy();
  });
});
