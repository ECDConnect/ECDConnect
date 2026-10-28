import '@/utils/security/test-webcrypto';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PinSetup } from './pin-setup';
import { PinUnlock } from './pin-unlock';
import { hasPin, savePin } from '@/utils/security/pin-lock';

const fast = { iterations: 1000 };

const enterPin = (pin: string) => {
  pin.split('').forEach((digit) => {
    fireEvent.click(screen.getByRole('button', { name: digit }));
  });
};

describe('PIN screens', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('saves a PIN after the confirmation matches', async () => {
    const onComplete = vi.fn();
    render(
      <PinSetup userId="user-1" onComplete={onComplete} onSkip={vi.fn()} />
    );

    enterPin('2580');
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    enterPin('2580');
    fireEvent.click(screen.getByRole('button', { name: 'Save PIN' }));

    await waitFor(() => expect(onComplete).toHaveBeenCalledOnce());
    expect(hasPin('user-1')).toBe(true);
  });

  it('asks for the PIN again when the confirmation does not match', () => {
    render(<PinSetup userId="user-1" onComplete={vi.fn()} onSkip={vi.fn()} />);

    enterPin('2580');
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    enterPin('2581');
    fireEvent.click(screen.getByRole('button', { name: 'Save PIN' }));

    expect(
      screen.getByText('Those PINs do not match. Enter it again.')
    ).toBeTruthy();
    expect(hasPin('user-1')).toBe(false);
  });

  it('skips setup when the practitioner chooses not now', () => {
    const onSkip = vi.fn();
    render(<PinSetup userId="user-1" onComplete={vi.fn()} onSkip={onSkip} />);

    fireEvent.click(screen.getByRole('button', { name: 'Not now' }));

    expect(onSkip).toHaveBeenCalledOnce();
  });

  it('unlocks when the PIN matches', async () => {
    await savePin('user-1', '2580', fast);
    const onUnlock = vi.fn();
    render(
      <PinUnlock userId="user-1" onUnlock={onUnlock} onUsePassword={vi.fn()} />
    );

    enterPin('2580');

    await waitFor(() => expect(onUnlock).toHaveBeenCalledOnce());
  });

  it('offers the password after five wrong PINs', async () => {
    await savePin('user-1', '2580', fast);
    const onUsePassword = vi.fn();
    render(
      <PinUnlock
        userId="user-1"
        onUnlock={vi.fn()}
        onUsePassword={onUsePassword}
      />
    );

    for (let attempt = 0; attempt < 4; attempt += 1) {
      enterPin('0000');
      await screen.findByText('That PIN is not right.');
    }

    enterPin('0000');
    await waitFor(() => expect(onUsePassword).toHaveBeenCalledOnce());
  });
});
