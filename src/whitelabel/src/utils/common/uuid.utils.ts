import { v4 as uuidv4 } from 'uuid';

export const newGuid = (): string => {
  return uuidv4();
};
