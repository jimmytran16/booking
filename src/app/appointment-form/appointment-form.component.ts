import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppointmentData, ConfirmationApiService } from '../confirmation-api.service';
import { finalize, startWith, Subject } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})
export class AppointmentFormComponent implements OnInit {
  // NOTE: data will come from DB
  readonly staffNames: string[] = ["Anyone","Julie", "Jenny", "JJ"];
  readonly services: string[] = ["Manicure ($45) - 30 minutes", "Pedicure ($45) - 30 minutes", "Dip ($45) - 30 minutes"]
  readonly availableTimes: string[] = this.generateTimeAvailibilities();
  readonly startDate = this.getTodaysDateMidnightTime()
  
  staffForm = this.fb.group({
    worker: ['', Validators.required],
  });
  serviceForm = this.fb.group({
    services: [[], Validators.required],
  });
  timeForm = this.fb.group({
    dateSelected : [this.startDate, Validators.required],
    time: ["", Validators.required],
  });
  infoForm = this.fb.group({
    name: ["jimmy tran", Validators.required],
    number: ["1111111111", [Validators.required, Validators.pattern('^[- +()0-9]+$')]],
  });
  
  unavailableTimes: string[] = []
  previouslySelectedStaff = "";
  onTimeStepChange = new Subject();
  isLoading = false;
  isCompleted = false;
  constructor(private fb: FormBuilder, private confirmationService: ConfirmationApiService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.timeForm.get('dateSelected')?.valueChanges.pipe(startWith(this.getTodaysDateMidnightTime()))
      .subscribe(date => {
        const staff = this.staffForm.get('worker')?.value;
        if (date && staff) {
          this.getUnavailables(date, staff);
        }
      })
    this.onTimeStepChange.asObservable().subscribe(() => {
      const staff = this.staffForm.get('worker')?.value;
      const staffHasChanged = this.previouslySelectedStaff != staff;
      const date = this.timeForm.get('dateSelected')?.value;
      if (staffHasChanged && date && staff) {
        this.previouslySelectedStaff = staff;
        this.getUnavailables(date, staff);
      }
    })
  }

  get isValidForm(): boolean{
    return this.staffForm.valid && this.serviceForm.valid && this.timeForm.valid && this.infoForm.valid;
  }

  getUnavailables(dateSelected: string, staff: string): void {
    this.isLoading = true;
    this.confirmationService.getUnavailabilities(dateSelected, staff)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(response => {
      if (response.success == true){
        this.timeForm.get('time')?.patchValue("");
        this.unavailableTimes = response.unavailables;
      }
      else {
        this.unavailableTimes = [];
      }
    }) 
  }
  
  isUnavailable(time: string): boolean {
    return this.unavailableTimes.includes(time)
  }

  onStepChange(event: any): void {
    if (event?.selectedIndex == 2) {
      this.onTimeStepChange.next(1);
    }
  }

  submit(stepper: MatStepper): void {
    const payload: AppointmentData = {
      name: this.infoForm.get('name')?.value ?? "",
      number: this.infoForm.get('number')?.value ?? "",
      services: this.serviceForm.get('services')?.value ?? [],
      time: this.timeForm.get('time')?.value ?? "",
      worker: this.staffForm.get('worker')?.value ?? "",
      date: this.timeForm.get('dateSelected')?.value ?? ""
    }

    this.confirmationService.appointmentSubmit(payload).subscribe(() => {
      // handle error validation
      this.isCompleted = true;
      stepper.next();
    })
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

  private getTodaysDateMidnightTime(): string {
    var date = new Date();
    date.setHours(0,0,0,0);
    return date.toISOString();
  }
}
