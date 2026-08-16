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
});
