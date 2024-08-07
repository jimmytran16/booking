import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppointmentData, ConfirmationApiService, Service } from '../confirmation-api.service';
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
  readonly availableTimes: string[] = this.generateTimeAvailibilities();
  readonly startDate = this.getTodaysDateMidnightTime();
  
  staffForm = this.fb.group({
    worker: ['', Validators.required],
  });
  serviceForm = this.fb.group({
    services: [null],
  });
  timeForm = this.fb.group({
    dateSelected : [this.startDate, Validators.required],
    time: ["", Validators.required],
  });
  infoForm = this.fb.group({
    name: ["jimmy tran", Validators.required],
    number: ["1111111111", [Validators.required, Validators.pattern('^[- +()0-9]+$')]],
  });
  
  services: Service[] = []
  unavailableTimes: string[] = [];
  previouslySelectedStaff = "";
  previouslySelectedServices: string[] = [];
  onTimeStepChange = new Subject();
  isLoading = false;
  isCompleted = false;
  private _selectedServices: string[] = []
  constructor(private fb: FormBuilder, private confirmationService: ConfirmationApiService) {}

  ngOnInit(): void {
    this.confirmationService.getServices().subscribe((services: Service[]) => {
      this.services = services;
    })
    // listener for date selection
    this.timeForm.get('dateSelected')?.valueChanges.pipe(startWith(this.getTodaysDateMidnightTime()))
      .subscribe(date => {
        const staff = this.staffForm.get('worker')?.value;
        // const services = this.serviceForm.get('services')?.value;
        const services = this.selectedServices;
        if (date && staff && services) {
          this.getUnavailables(date, staff, this.getTotalTimeByService(services));
        }
      })
      // listener for 3rd step
    this.onTimeStepChange.asObservable().subscribe(() => {
      const staff = this.staffForm.get('worker')?.value;
      // const services = this.serviceForm.get('services')?.value;
      const services = this.selectedServices;
      const staffHasChanged = this.previouslySelectedStaff != staff;
      const servicesHasChanged =  this.previouslySelectedServices.sort() != (services ?? [] as string[]).sort();
      const date = this.timeForm.get('dateSelected')?.value;
      if ((servicesHasChanged || staffHasChanged) && date && staff && services) {
        this.previouslySelectedStaff = staff;
        this.previouslySelectedServices = [...services] ?? [];
        this.getUnavailables(date, staff, this.getTotalTimeByService(services));
      }
    })
  }

  get isValidForm(): boolean{
    return this.staffForm.valid && this.serviceForm.valid && this.timeForm.valid && this.infoForm.valid;
  }

  get selectedServices(): string[] {
    return this._selectedServices;
  }

  private getTotalTimeByService(services: string[]): number {
    const includedServices = this.services.filter(x => services.includes(x.name));
    return includedServices.map(x => x.required_time).reduce((a, b) => a + b, 0);
  }

  handleProfessionalSelection(staffName: string): void {
    this.staffForm.get('worker')?.patchValue(staffName ?? '');
  }

  handleServicesSelection(serviceName: string): void {

    const selectedServies = this.selectedServices;
    const index = selectedServies.indexOf(serviceName);
    // Not in list, then add
    if (index == -1) {
      this._selectedServices.push(serviceName)
    } else {
      this._selectedServices.splice(index, 1);
    } 
    // Issue with patchValue -- getting TS2345: Argument of type 'string[]' is not assignable to parameter of type 'null'
    // Workaround.. will just use this.selectedServices as state
    // this.serviceForm.get('services')?.patchValue(this.selectedServices)
  }

  handleTimeSelection(timeSelected: string) {
    this.timeForm.get('time')?.patchValue(timeSelected);
  }

  getUnavailables(dateSelected: string, staff: string, requested_time: number): void {
    this.isLoading = true;
    this.confirmationService.getUnavailabilities(dateSelected, staff, requested_time)
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
      services: this.selectedServices ?? [],
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

  getTodaysDateMidnightTime(): string {
    var date = new Date();
    date.setHours(0,0,0,0);
    return date.toISOString();
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
