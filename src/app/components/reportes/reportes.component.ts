import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {Observable}from 'rxjs/Observable';
import {FormControl, Validators} from '@angular/forms';

import {MatSnackBar} from '@angular/material';

import { StudentAtentionService } from "../../service/student-atention.service";
import { StudentService } from "../../class/studentService";
import * as XLSX from 'xlsx';

//Metodo generar Excel
//type AOA = any[][];

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  //Variables
  //
  //Object to export xlsx
  //
  workBook;

  //
  //Object to keep the information for consult
  //

  dateJSON = {
    Date1: null,
    Date2: null
  }
  
  step = 0;
  objBuscarJSON = {
    Nombre: '',
    Apellido: '',
    Correo: '',
    Fecha1: 0,
    Fecha2: 0,    
    Servicio: '',
    Estado: ''
  }
  //
  //array with options for inputbox
  //
  
  services = [
    {value: 'Cambio de Contraseña CV', viewValue: 'Cambio de Contraseña CV'},
    {value: 'Guia Campus Virtual', viewValue: 'Guia Campus Virtual'},
    {value: 'Otros Campus Virtual', viewValue: 'Otros Campus Virtual'},
    {value: 'Cambio de Contraseña SA', viewValue: 'Cambio de Contraseña SA'},
    {value: 'Usuario de Microsoft Imagine', viewValue: 'Usuario de Microsoft Imagine'},
    {value: 'Actividades Fide-learning', viewValue: 'Actividades Fide-learning'}
  ];
  options = [
    {value: 'Resuelto', viewValue: 'Resuelto'},
    {value: 'Sin Resolver', viewValue: 'Sin Resolver'},
    {value: 'Atendido', viewValue: 'Atendido'}
  ];

  //
  //Obsevable array for return
  //
  filteredOptions: Observable<string[]>;
  filteredService: Observable<string[]>;

  //
  //definition of controllers
  //
  myControl = new FormControl('', [
    
  ]);
  serviceControl = new FormControl('', [
    
  ]);
  emailFormControl = new FormControl('', [
    Validators.email,
  ]);
  nombreFormControl = new FormControl('', [
    
  ]);
  apellidoFormControl = new FormControl('', [
    
  ]);
  dateFormControl1 = new FormControl('', [
    
  ]);

  dateFormControl2 = new FormControl('', [
    
  ]);

  //
  //Table definitions
  //
  atentions: StudentService[];
  displayedColumns = ['Nombre', 'Apellido', 'Correo', 'Fecha', 'Servicio', 'Estado'];
  dataSource = new MatTableDataSource();
  
  //
  //filter metod
  //
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(public studentAtentionService: StudentAtentionService, public snackBar: MatSnackBar) { }

  ngOnInit() {
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
  //Method to make a consult
  //
  getServiceDate() {
    //if(this.dateJSON.Date1 > this.dateJSON.Date2){
		this.objBuscarJSON.Fecha1 = this.toEpochDate(this.dateJSON.Date1);
		this.objBuscarJSON.Fecha2 = this.toEpochDate(this.dateJSON.Date2);
    //Generate the query object
		this.objBuscarJSON = this.queryConstruction(this.objBuscarJSON);
    this.objBuscarJSON = this.upperCaseObject(this.objBuscarJSON);
    console.log(this.objBuscarJSON);
    //Send the consult
			this.studentAtentionService.getServiceDate(this.objBuscarJSON.Nombre, this.objBuscarJSON.Apellido, this.objBuscarJSON.Correo, this.objBuscarJSON.Fecha1, this.objBuscarJSON.Fecha2, this.objBuscarJSON.Servicio, this.objBuscarJSON.Estado)
			.subscribe(atention => {
			this.atentions = this.toHumanDate(atention);
			this.workBook = atention; //assign object return from database to global variable
			this.dataSource = new MatTableDataSource(this.atentions);
			this.clean();
			})
	  //}
  }
      //this.openSnackBar("Debe completar por lo menos un campo", "Aceptar");
 
  //
  //Method to export the Workbook
  //
  exportWB() {
    xlsxExport(this.workBook);
  }

  // 
  /* Other Methods */
  //

  //
  //Epoch date format
  //  
  toEpochDate(pDate): number {
    var myDate = new Date(pDate); // Your timezone!
    var myEpoch = myDate.getTime()/1000.0;
    return myEpoch;
  }

  //
  //Human date format
  //
  toHumanDate(pDbJSON): StudentService[]{
    var result: StudentService[];
    var aux: StudentService[] = pDbJSON;
    for (var item of pDbJSON){
      var myDate = new Date( item.Fecha *1000);
      item.Fecha = myDate.toLocaleString();
    }
    return result = pDbJSON;
  }
  
  //
  //Definition the object for query
  //
  queryConstruction(objConsulta){
    if(objConsulta.Nombre == ''){
      objConsulta.Nombre = '&';
    }
    if(objConsulta.Apellido == ''){
      objConsulta.Apellido = '&';
    }      
    if(objConsulta.Correo == ''){
      objConsulta.Correo = '&';
    }        
    if(objConsulta.Fecha1 == 0){
      objConsulta.Fecha1 = 0;
    }              
    if(objConsulta.Fecha2 == 0){
      objConsulta.Fecha2 = 0;
    }  
    if(objConsulta.Servicio == ''){
      objConsulta.Servicio = '&';
    }                    
    if(objConsulta.Estado == ''){
      objConsulta.Estado = '&';  
    }    
  return objConsulta;
  }


  //
  //Method to clean variables
  //
  clean() {
    this.objBuscarJSON.Nombre = '';
    this.objBuscarJSON.Apellido = '';
    this.objBuscarJSON.Correo = '';
    this.objBuscarJSON.Fecha1 = 0;
    this.objBuscarJSON.Fecha2 = 0;
    this.objBuscarJSON.Servicio = '';
    this.objBuscarJSON.Estado = '';
  }
  
  //
  //method to comprobe the user complete all the spaces
  //
  validating(): boolean{
    if(this.objBuscarJSON.Nombre == ""){
      if(this.objBuscarJSON.Apellido == ""){
        if(this.objBuscarJSON.Correo == ""){
          if(this.objBuscarJSON.Fecha1 == null){
            if(this.objBuscarJSON.Fecha2 == null){
              if(this.objBuscarJSON.Servicio == ""){
                if(this.objBuscarJSON.Estado == ""){
                  return false;
                }
              }
            }  
          }
        }
      }
    }else {
      return true;
    }
  }

  //
  //Method to call a snackBar
  //
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  upperCaseObject(objConsulta){
    var objResultado = {
      Nombre: '',
      Apellido: '',
      Correo: '',
      Fecha1: 0,
      Fecha2: 0,    
      Servicio: '',
      Estado: ''
    };
    objResultado.Nombre = objConsulta.Nombre.toUpperCase();
    objResultado.Apellido = objConsulta.Apellido.toUpperCase();
    objResultado.Correo = objConsulta.Correo.toUpperCase();
    objResultado.Fecha1 = objConsulta.Fecha1;
    objResultado.Fecha2 = objConsulta.Fecha2;
    objResultado.Servicio = objConsulta.Servicio.toUpperCase();
    objResultado.Estado = objConsulta.Estado.toUpperCase();

    return objResultado;
  }

  /*
  objBuscarJSON = {
    Nombre: '',
    Apellido: '',
    Correo: '',
    Fecha1: 0,
    Fecha2: 0,    
    Servicio: '',
    Estado: ''
  }*/
}

  //
  //Method to save information to excel
  //
  function xlsxExport(atention){
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(atention);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Report.xlsx');
  }

  