import { Component, OnInit } from '@angular/core';
import { StatsService, IGetStatsResponse, IPostStatsResponse, ResourceType } from './stats/service/stats.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  constructor(private statsService: StatsService) {}

  public cpuUsage: number;
  public ramUsage: number;

  public jobsActive: number;
  public objectsInMemory: number;

  updateStats(): void {
    this.statsService.getStats().subscribe((data: IGetStatsResponse) => {
      this.cpuUsage = data.cpu;
      this.ramUsage = data.ram;
    });
  }

  changeRam(value: any): void {
    console.log(`change ram to: ${value}`);
    this.statsService.postStats(value, ResourceType.RAM).subscribe(({objectsInMemory}: IPostStatsResponse) => {
      this.objectsInMemory = objectsInMemory;
    });
  }

  changeCpu(value: any): void {
    console.log(`change cpu to: ${value}`);
    this.statsService.postStats(value, ResourceType.CPU).subscribe(({jobsActive}: IPostStatsResponse) => {
      this.jobsActive = jobsActive;
    });
  }

  ngOnInit(): void {
    setInterval(() => {
      this.updateStats();
    }, 1000);
  }
}
