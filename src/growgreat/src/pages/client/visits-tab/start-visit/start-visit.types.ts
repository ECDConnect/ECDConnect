export type StartVisitClientType = 'mother' | 'infant';

export interface StartVisitClient {
  id: string | undefined;
  type: StartVisitClientType;
}
