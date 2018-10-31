import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {  ErrorStateMatcher } from '@angular/material/core';
import {MatSnackBar} from '@angular/material';
import { StudentAtentionService } from "../../service/student-atention.service";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})
export class EstudiantesComponent implements OnInit {

    //
    //Array with services
    //
    atentions;//: StudentService[];

    //
    //definition of variables
    //
    fecha;
    message1: string = "Debe confirmar el formulario";
    message2: string = "Existen Campos Vacios";
    step = 0;
    studentAtentionJSON = {
      Nombre: '',
      Apellido: '',
      Correo: '',
      Fecha: 0,
      Servicio: '',
      Estado: '',
      isDone: false
    }

    //
    //array with options for inputbox
    //
    options = ['Resuelto', 'Sin Resolver', 'Atendido'];
    services = [
      'Cambio de Contraseña CV',
      'Guia Campus Virtual',
      'Otros Campus Virtual',
      'Cambio de Contraseña SA',
      'Usuario de Microsoft Imagine',
      'Servicios MasterLex y VLex',
      'Actividades Fide-learning'
    ];

    //
    //observable array from return
    //
    filteredOptions: Observable<string[]>;
    filteredService: Observable<string[]>;

    //
    //definition of controllers
    //
    myControl = new FormControl('', [
      Validators.required
    ]);
    serviceControl = new FormControl('', [
      Validators.required
    ]);
    emailFormControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);
    nombreFormControl = new FormControl('', [
      Validators.required
    ]);
    apellidoFormControl = new FormControl('', [
      Validators.required
    ]);
    dateFormControl = new FormControl('', [
      Validators.required
    ]);

    //
    //mathcher from errors
    //
    matcher = new MyErrorStateMatcher();
    errorMatcher = new MyErrorStateMatcher();

    //
    //Aplication Constructor
    //
    constructor(public studentAtentionService: StudentAtentionService, public snackBar: MatSnackBar) {

     }

    //
    //Inicializing method
    //
    ngOnInit() {

      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(val => this.filter(val))
      );

      this.filteredService = this.serviceControl.valueChanges.pipe(
        startWith(''),
        map(valor => this.filterService(valor) )
      );

    }


    //
    //methods to walk in the mat-accordeon
    //
    setStep(index: number) {
      this.step = index;
    }

    nextStep() {
      this.step++;
    }

    prevStep() {
      this.step--;
    }



    //
    //methods to return the observable
    //

    filter(val: string): string[] {
      return this.options.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    filterService(valor: string): string[] {
      return this.services.filter(service => service.toLowerCase().indexOf(valor.toLowerCase()) === 0);
    }

    //
    //method to save the information
    //
    addAtention(){
      this.studentAtentionJSON.Fecha = this.epochDate(this.fecha)
      if(this.validating()){
        if(this.studentAtentionJSON.isDone == true){
          this.studentAtentionService.addService(this.studentAtentionJSON)
            .subscribe(atention => {
              //this.atentions. push(atention);
              this.clean();
            });
          }else {
            this.openSnackBar(this.message1, "Aceptar");
          }
      }else {
        this.openSnackBar(this.message2, "Aceptar");
      }

    };

    //
    //method to comprobe the user complete all the spaces
    //
    validating(): boolean{
      if(this.studentAtentionJSON.Nombre != ""){
        if(this.studentAtentionJSON.Apellido != ""){
          if(this.studentAtentionJSON.Correo != ""){
            if(this.studentAtentionJSON.Fecha != null){
              if(this.studentAtentionJSON.Servicio != ""){
                if(this.studentAtentionJSON.Estado != ""){
                  return true;
                }
              }
            }
          }
        }
      }else {
        return false;
      }
    }
    
    //
    //Method to transform in epoch date
    //
    epochDate(pFecha: Date): number {
      var result: number; //variable a retornar
      var myDate = new Date(pFecha); // Your timezone!
      var myEpoch = myDate.getTime()/1000.0; //epoch convert
      return result = myEpoch; // return epoch date
    }

    //
    //Method to clean fields
    //
    clean() {
        this.studentAtentionJSON.Nombre = '';
        this.studentAtentionJSON.Apellido = '';
        this.studentAtentionJSON.Correo = '';
        this.studentAtentionJSON.Fecha = 0;
        this.studentAtentionJSON.Servicio = '',
        this.studentAtentionJSON.Estado = '';
        this.studentAtentionJSON.isDone = false;
        this.fecha = null;
    }

    //
    //Method to call a snackBar
    //
    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 3000,
      });
    }
}
