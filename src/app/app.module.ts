import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Form1Component } from './form1/form1.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { MatStepperModule } from '@angular/material/stepper';



@NgModule({
  declarations: [AppComponent, Form1Component, AppointmentFormComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterOutlet, 
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatStepperModule,
    FormsModule,
  ],
  providers: [MatDatepickerModule, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
