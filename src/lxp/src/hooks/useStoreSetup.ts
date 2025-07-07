import { useContext } from 'react';
import { IntialStoreSetupContext } from '../initial-store-setup';

export const useStoreSetup = () => useContext(IntialStoreSetupContext);
