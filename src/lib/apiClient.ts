import { USER_KEY } from './constants.ts';

export class ApiClient {
  private readonly baseUrl = import.meta.env.VITE_BASE_URL;

  public async get<T>(path: string, authenticated = true): Promise<T> {
    return await this.request('GET', path, undefined, authenticated);
  }

  public async post<T>(path: string, body: unknown, authenticated = true): Promise<T> {
    return await this.request('POST', path, body, authenticated);
  }

  public async put<T>(path: string, body: unknown, authenticated = true): Promise<T> {
    return await this.request('PUT', path, body, authenticated);
  }

  public async patch<T>(path: string, body: unknown, authenticated = true): Promise<T> {
    return await this.request('PATCH', path, body, authenticated);
  }

  public async delete<T>(path: string, body: unknown, authenticated = true): Promise<T> {
    return await this.request('DELETE', path, body, authenticated);
  }

  private async request<T>(
    method: string,
    path: string,
    body: unknown,
    authenticated = true
  ): Promise<T> {
    const requestInit: RequestInit = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) {
      requestInit.body = JSON.stringify(body);
    }
    if (authenticated) {
      const sessionString = localStorage.getItem(USER_KEY);
      if (!sessionString) throw new Error('No user session in local storage');
      const session = JSON.parse(sessionString);
      requestInit.headers = { ...requestInit.headers, Authorization: `Bearer ${session.token}` };
    }
    const response = await fetch(this.baseUrl + path, requestInit);
    if (!response.ok) {
      const { error } = await response.json();
      console.error(`Error during the ${method}: ${path} request.`, {
        method,
        path,
        body,
        authenticated,
        status: response.status,
        error,
      });
      throw new Error(error);
    }
    return (await response.json()) as T;
  }
}
