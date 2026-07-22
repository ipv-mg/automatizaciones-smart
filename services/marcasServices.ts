import { APIRequestContext } from '@playwright/test';

export class MarcasService {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl = 'https://api.qa.appsmart.pe') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async crearMarca(token: string, payload: any) {
    return await this.request.post(`${this.baseUrl}/api/marcas/crearMarca`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://qa.appsmart.pe'
      },
      data: payload
    });
  }
}