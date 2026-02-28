import { AUTHORIZATION } from '../constants/constants.js';

export default class ApiClient {
  constructor(endpoint) {
    this._endpoint = endpoint;
  }

  async _load({url, method = 'GET', body = null, headers = {} }) {
    const response = await fetch(`${this._endpoint}${url}`, {
      method,
      body,
      headers: {
        ...headers,
        'Authorization': AUTHORIZATION,
      }
    });

    if (!response.ok){
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return response;
  }

  async getPoints(){
    const response = await this._load({ url: '/points' });
    return response.json();
  }

  async getDestinations(){
    const response = await this._load({ url: '/destinations' });
    return response.json();
  }

  async getOffers() {
    const response = await this._load({ url: '/offers' });
    return response.json();
  }

  async updatePoint(pointId, pointData) {
    const response = await this._load({
      url: `/points/${pointId}`,
      method: 'PUT',
      body: JSON.stringify(pointData),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async addPoint(pointData){
    const response = await this._load({
      url: '/points',
      method: 'POST',
      body: JSON.stringify(pointData),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async deletePoint(pointId){
    await this._load({
      url: `/points/${pointId}`,
      method: 'DELETE'
    });
  }
}
