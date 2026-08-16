import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import App from '../App';

describe('App navigation', () => {
  it('opens the floral agenda from the home CTA', () => {
    render(<App />);

    fireEvent.press(screen.getByRole('button', { name: /open agenda/i }));

    expect(screen.getByText('Today’s bloom')).toBeTruthy();
    expect(screen.getByTestId('agenda-flowers-background')).toBeTruthy();
  });

  it('returns home from the agenda back control', () => {
    render(<App />);

    fireEvent.press(screen.getByRole('button', { name: /open agenda/i }));
    fireEvent.press(screen.getByRole('button', { name: /back to home/i }));

    expect(screen.getByText('kwagenda')).toBeTruthy();
    expect(screen.getByText('Your agenda, blooming into place.')).toBeTruthy();
  });

  it('opens the completed summary from the home button', () => {
    render(<App />);

    fireEvent.press(screen.getByRole('button', { name: /see completed/i }));

    expect(screen.getByText('Completed blooms')).toBeTruthy();
    expect(screen.getByTestId('completed-flowers-background')).toBeTruthy();
  });

  it('returns home from the completed summary back control', () => {
    render(<App />);

    fireEvent.press(screen.getByRole('button', { name: /see completed/i }));
    fireEvent.press(screen.getByRole('button', { name: /back to home/i }));

    expect(screen.getByText('kwagenda')).toBeTruthy();
    expect(screen.getByText('Your agenda, blooming into place.')).toBeTruthy();
  });

  it('shows a task in the completed summary after marking it done', () => {
    render(<App />);

    fireEvent.press(screen.getByRole('button', { name: /open agenda/i }));
    fireEvent.press(
      screen.getByRole('button', {
        name: /mark morning walk among the blooms done/i,
      }),
    );
    fireEvent.press(screen.getByRole('button', { name: /back to home/i }));
    fireEvent.press(screen.getByRole('button', { name: /see completed/i }));

    expect(screen.getByText('Morning walk among the blooms')).toBeTruthy();
    expect(screen.getByText(/1 completed/i)).toBeTruthy();
  });
});

