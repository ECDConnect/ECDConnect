interface TimeoutType {
  [key: string]: {
    slowRequestTime: number;
    loadIssueTime: number;
  };
}

export const TIMEOUTS: TimeoutType = {
  '4g': {
    slowRequestTime: 10000,
    loadIssueTime: 20000,
  },
  '3g': {
    slowRequestTime: 10000,
    loadIssueTime: 30000,
  },
  '2g': {
    slowRequestTime: 10000,
    loadIssueTime: 40000,
  },
  'slow-2g': {
    slowRequestTime: 10000,
    loadIssueTime: 50000,
  },
};
