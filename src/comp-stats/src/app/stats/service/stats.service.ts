import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IGetStatsResponse {
  cpu: number;
  ram: number;
}

export interface IPostStatsResponse {
  cpu: number;
  ram: number;
  objectsInMemory: number;
  jobsActive: number;
}

export enum ResourceType {
  RAM = 'RAM',
  CPU = 'CPU'
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  constructor(private httpClient: HttpClient) {}

  getStats(): Observable<IGetStatsResponse> {
    return this.httpClient.get<IGetStatsResponse>('/stats');
  }

  postStats(percentage: number, type: ResourceType): Observable<IPostStatsResponse> {
    return this.httpClient.post<IPostStatsResponse>('/stats', {
      percentage,
      type
    });
  }
}
