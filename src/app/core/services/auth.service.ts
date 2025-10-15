import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { LoginRequest, LoginResponse } from "../models/auth.model";


export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(dto: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, dto);
  }

  refresh(refreshToken: string) {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/auth/refresh`, { refreshToken });
  }
  register(dto: RegisterRequest) {

  return this.http.post(`${environment.apiBaseUrl}/authentication/register`, dto);
}
}
