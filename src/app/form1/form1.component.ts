import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form1',
  templateUrl: './form1.component.html',
  styleUrl: './form1.component.scss'
})
export class Form1Component {
  title = 'dns-scheduling-app';
  appointmentForm: FormGroup = new FormGroup({
    phoneNumber: new FormControl("", Validators.required),
    time: new FormControl("", Validators.required),
    date: new FormControl("", Validators.required)
  })
  readonly availableTimes: string[] = this.generateTimeAvailibilities();
  
  submit(): void {
    console.log(this.appointmentForm.valid);
    console.log(this.appointmentForm.getRawValue());
  }

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
