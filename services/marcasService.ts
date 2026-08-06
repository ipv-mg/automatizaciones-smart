import { APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const origin = process.env.ORIGIN || '';
const url = process.env.TEST_BASE_URL || '';

export class MarcasService {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl = url) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async crearMarca(token: string, payload: any) {
    return await this.request.post(`${this.baseUrl}/api/marcas/crearMarca`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': origin
      },
      data: payload
    });
  }
}