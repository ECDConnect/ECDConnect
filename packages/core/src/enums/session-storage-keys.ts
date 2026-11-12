/**
 * Keys for state that belongs to a single browsing session: hand-off values
 * between steps of a flow, and one-shot UI prompts raised at login.
 *
 * Anything that should outlive the session belongs in redux or on the server,
 * not here — and not in `LocalStorageKeys`, which is not cleared on logout and
 * is therefore shared by every user of the device.
 */
export enum SessionStorageKeys {
  firstTimeOnCommunityDashboard = 'firstTimeOnCommunityDashboard',
  practitionerInvitedPrincipalIdNumber = 'practitionerInvitedPrincipal',
  practitionerInvitedPrincipalUserId = 'practitionerInvitedPrincipalUserId',
  selectedUser = 'selectedUser',
  selectedMessage = 'selectedMessage',
  passwordResetEmail = 'passwordResetEmail',
}
