import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';

import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';

import { Appointment } from '../appointment';
import { AppointmentService } from '../services/AppointmentService';

import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendarPlugins = [dayGridPlugin]; // important!
  appointmentForm: FormGroup;
  auth: string;
  errorMessage: string;
  errorDate: string;
  validation: any = {};
  today: string;
  appointment: Appointment;
  tabAppointment= [];
  date= [];
  name:string;
  dateEvent:string;
  result: any;
  showModal: boolean;
  calendarOptions: any;

  constructor(private appointmentService: AppointmentService, private fb: FormBuilder) { }

  ngOnInit() {
    this.today = moment().format('YYYY-MM-DD');
    this.auth = localStorage.getItem('Auth');
    this.appointmentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      date: ['',[Validators.required]],
      hour: ['',[Validators.required]],
      additional_informations: ['']
    });
    this.getAppointment();
  }

  getAppointment(): void {
    this.appointmentService.getAppointment(this.auth).subscribe({
      next: value => {
        console.log(value);
        this.appointment = value;
      },
      error: err => console.log(err),
      complete: () => {
        console.log('ok');
      }
    })
  };

  addAppointment(): void {
    var error = 0;
    console.log(this.appointmentForm.value.date);
    if(this.appointmentForm.value.date, moment(this.appointmentForm.value.date, 'YYYY-MM-DD', true).isValid() == false) {
      error++;
      this.errorDate = 'La date n\'est pas dans le bon format.';
    }
    console.log(this.today)
    if(moment(this.appointmentForm.value.date).isSameOrBefore(this.today) == true) {
      this.errorDate = 'La date doit être une date future.';
      error++;
    }
    if(error == 0) {
      this.appointmentForm.value.date = this.appointmentForm.value.date + ' ' + this.appointmentForm.value.hour;
      console.log(this.appointmentForm.value.date);
      this.appointmentService.addAppointment(this.appointmentForm.value, this.auth).subscribe({
        next: value => {
          this.validation = value;
          console.log(this.validation)
          if(this.validation.error != undefined) {
            this.errorMessage = this.validation.error.error;
            console.log(this.errorMessage)
          }
        },
        error: err => console.log(err),
        complete: () => console.log('ok')
      });
    }
  }

  eventClick(model: any) {
    console.log(model);
    this.showModal = true;
  }
  hide() {
    this.showModal = false;
  }

}
