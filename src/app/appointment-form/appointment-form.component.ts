import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppointmentData, ConfirmationApiService } from '../confirmation-api.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})
export class AppointmentFormComponent implements OnInit {
  // NOTE: data will come from DB
  readonly staffNames: string[] = ["Anyone","Julie", "Jenny", "JJ"]
  readonly services: string[] = ["Manicure ($45) - 30 minutes", "Pedicure ($45) - 30 minutes", "Dip ($45) - 30 minutes"]
  readonly availableTimes: string[] = this.generateTimeAvailibilities()
  readonly isEditable = true;
  
  staffForm = this.fb.group({
    worker: ['', Validators.required],
  });
  serviceForm = this.fb.group({
    services: [[], Validators.required],
  });
  timeForm = this.fb.group({
    dateSelected : ['', Validators.required],
    time: ["", Validators.required],
  });
  infoForm = this.fb.group({
    name: ["jimmy tran", Validators.required],
    number: ["7812671202", [Validators.required, Validators.pattern('^[- +()0-9]+$')]],
  });
  
  unavailableTimes: string[] = []
  constructor(private fb: FormBuilder, private confirmationService: ConfirmationApiService) {}

  ngOnInit(): void {
    this.timeForm.get('dateSelected')?.valueChanges.subscribe(v => {
      // Call API to get availibilities
      console.log(v)
      const staff = this.staffForm.get('worker')?.value;
      if (staff && v) {
        this.confirmationService.getUnavailabilities(v, staff).subscribe(response => {
          if (response.success == true)
            this.unavailableTimes = response.unavailables;
          else 
            this.unavailableTimes = [];
        }) 
      }
    })
  }

  
  get isValidForm(): boolean{
    return this.staffForm.valid && this.serviceForm.valid && this.timeForm.valid && this.infoForm.valid;
  }
  
  isUnavailable(time: string): boolean {
    return this.unavailableTimes.includes(time)
  }

  submit(): void {
    const payload: AppointmentData = {
      name: this.infoForm.get('name')?.value ?? "",
      number: this.infoForm.get('number')?.value ?? "",
      services: this.serviceForm.get('services')?.value ?? [],
      time: this.timeForm.get('time')?.value ?? "",
      worker: this.staffForm.get('worker')?.value ?? "",
      date: this.timeForm.get('dateSelected')?.value ?? ""
    }

    this.confirmationService.appointmentSubmit(payload).subscribe()
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


    console.log('availibleTimes',availibleTimes)
    return availibleTimes;
  }

  private getAMOrPM(time: number): string {
    return time >= 9 && time < 12 
      ? "AM"
      : "PM"
  }
}
