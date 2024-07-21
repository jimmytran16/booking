import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})
export class AppointmentFormComponent {
  // NOTE: data will come from DB
  readonly staffNames: string[] = ["Anyone","Julie", "Jenny", "JJ"]
  readonly services: string[] = ["Manicure ($45) - 30 minutes", "Pedicure ($45) - 30 minutes", "Dip ($45) - 30 minutes"]
  readonly availableTimes: string[] = this.generateTimeAvailibilities();
  readonly isEditable = true;
  
  staffForm = this.fb.group({
    worker: ['', Validators.required],
  });
  serviceForm = this.fb.group({
    services: [[], Validators.required],
  });
  timeForm = this.fb.group({
    time: [[], Validators.required],
  });
  infoForm = this.fb.group({
    name: ["", Validators.required],
    number: ["", [Validators.required, Validators.pattern('^[- +()0-9]+$')]],
  });
  constructor(private fb: FormBuilder) {}

  get isValidForm(): boolean{
    return this.staffForm.valid && this.serviceForm.valid && this.timeForm.valid && this.infoForm.valid;
  }

  submit(): void {
    console.log(this.staffForm.getRawValue());
    console.log(this.serviceForm.getRawValue());
    console.log(this.timeForm.getRawValue());
    console.log(this.infoForm.getRawValue());
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
