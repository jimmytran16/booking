import { Component } from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dns-scheduling-app';
  readonly availableTimes: string[] = this.generateTimeAvailibilities();


  // Generate an array of available times for the day
  // NOTE: May need to fetch from DB that way we can munipulate the times if need be
  private generateTimeAvailibilities(): string[] {
    var availibleTimes: string[] = []
    var availibleHours = [9,10,11,12,1,2,3,4,5,6,7];
    var availableMinutes = [0, 15, 30, 45]
    availibleHours.forEach(h => {
      availableMinutes.forEach(m => {
        availibleTimes.push(`${h}:${m == 0 ? "00": m} ${this.getAMOrPM(h)}`)
      })
    })

    return availibleTimes;
  }

  private getAMOrPM(time: number): string {
    return time >= 9 && time < 12 
      ? "AM"
      : "PM"
  }
}
