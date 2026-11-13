import { describe, expect, it } from 'vitest';
import { shouldOpenWhatsAppHelp } from './remote-config';

describe('shouldOpenWhatsAppHelp', () => {
  it('keeps WhatsApp for tenants that are not Open Access', () => {
    expect(shouldOpenWhatsAppHelp(false, null)).toBe(true);
    expect(
      shouldOpenWhatsAppHelp(false, { whatsAppHelpAvailable: false })
    ).toBe(true);
  });

  it('opens WhatsApp on Open Access only when the remote switch is on', () => {
    expect(shouldOpenWhatsAppHelp(true, { whatsAppHelpAvailable: true })).toBe(
      true
    );
  });

  it('shows the notice on Open Access when the switch is off or missing', () => {
    expect(shouldOpenWhatsAppHelp(true, { whatsAppHelpAvailable: false })).toBe(
      false
    );
    expect(shouldOpenWhatsAppHelp(true, {})).toBe(false);
    expect(shouldOpenWhatsAppHelp(true, null)).toBe(false);
  });
});
