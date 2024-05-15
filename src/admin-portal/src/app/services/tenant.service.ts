import { APIs, Config, TenantModel } from '@ecdlink/core';
import { api } from '../utils/axios.helper';

const handlerError = (error: any) => {
  return error?.response;
};

class TenantService {
  async GetCurrent(): Promise<TenantModel | null> {
    const BASE_URL = Config.authApi;
    const response = await api(BASE_URL)
      .get(APIs.tenantCurrent)
      .catch(handlerError);

    if (response.status < 300) return response.data;
    return null;
  }
}

export default TenantService;
