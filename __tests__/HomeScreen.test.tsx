import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import App from '../App';

describe('Home page', () => {
  it('renders the kwagenda brand as the primary hero signal', () => {
    render(<App />);
    expect(screen.getByText('kwagenda')).toBeTruthy();
  });

  it('shows a short supporting line under the brand', () => {
    render(<App />);
    expect(
      screen.getByText('Your agenda, blooming into place.'),
    ).toBeTruthy();
  });

  it('uses a full-bleed flowers background', () => {
    render(<App />);
    expect(screen.getByTestId('flowers-background')).toBeTruthy();
  });

  it('offers a primary call to action', () => {
    const { getByRole } = render(<App />);
    const cta = getByRole('button', { name: /open agenda/i });
    expect(cta).toBeTruthy();
    fireEvent.press(cta);
  });
});
