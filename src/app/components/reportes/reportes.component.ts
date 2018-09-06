import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {Observable}from 'rxjs/Observable';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';


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
  options = ['Resuelto', 'Sin Resolver', 'Atendido'];
  services = [
    'Cambio de Contraseña CV',
    'Guia Campus Virtual',
    'Otros Campus Virtual',
    'Cambio de Contraseña SA',
    'Usuario de Microsoft Imagine',
    'Servicios MasterLex y VLex'
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
  //mathcher from errors
  //

  //DB Charge Varaibles
  atentions: StudentService[];
  displayedColumns = ['Nombre', 'Apellido', 'Correo', 'Fecha', 'Servicio', 'Estado'];
  dataSource = new MatTableDataSource();
  

  //filter metod
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(public studentAtentionService: StudentAtentionService) { }

  ngOnInit() {
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

  //DB charge Method
  getService(): void{
    
  }

  
  getServiceDate() {
    
   // console.log(this.dateJSON.Date1)
    this.objBuscarJSON.Fecha1 = this.toEpochDate(this.dateJSON.Date1);
    this.objBuscarJSON.Fecha2 = this.toEpochDate(this.dateJSON.Date2);

    //Generación del objeto de busqueda
    this.objBuscarJSON = this.queryConstruction(this.objBuscarJSON)
    //console.log(this.objBuscarJSON);

    this.studentAtentionService.getServiceDate(this.objBuscarJSON.Nombre, this.objBuscarJSON.Apellido, this.objBuscarJSON.Correo, this.objBuscarJSON.Fecha1, this.objBuscarJSON.Fecha2, this.objBuscarJSON.Servicio, this.objBuscarJSON.Estado)
      .subscribe(atention => {
        console.log(atention);

        
        this.atentions = this.toHumanDate(atention);
        this.dataSource = new MatTableDataSource(this.atentions);
        this.clean();
    });
    
  }
 
  /*
  //Metodo generar Excel
  // export Variables
  data: AOA = [ [], [] ];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'Reporte.xlsx';
  jsonObject;
*/

  //Read Method
  /*
	onFileChange(evt: any) {
		// wire up file reader 
		const target: DataTransfer = <DataTransfer>(evt.target);
		if (target.files.length !== 1) throw new Error('Cannot use multiple files');
		const reader: FileReader = new FileReader();
		reader.onload = (e: any) => {
			// read workbook 
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

			// grab first sheet 
			const wsname: string = wb.SheetNames[0];
			const ws: XLSX.WorkSheet = wb.Sheets[wsname];

			// save data 
			this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
		};
		reader.readAsBinaryString(target.files[0]);
	}
  */

  // Export method
	//export(): void {
		/* generate worksheet */
		//const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet();

    /* metodo B
    var htmlstr = document.getElementById('tableToExport');
    const ws: XLSX.WorkSheet = XLSX.read(htmlstr, {type:'binary'});
    */

    /* generate workbook and add the worksheet */
	//	const wb: XLSX.WorkBook = XLSX.utils.book_new();
   //XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    //var table_dom_elt = document.getElementById('tableToImport');
    //var wb:XLSX.WorkBook = XLSX.utils.table_to_book(table_dom_elt);
   /* save to file */
		//XLSX.writeFile(wb, "export.xlsx");
	//}

  //
  //Epoch date Format
  //  
  toEpochDate(pDate): number {
    var myDate = new Date(pDate); // Your timezone!
    var myEpoch = myDate.getTime()/1000.0;
    return myEpoch;
  }

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
  //Create Object
  //
  queryConstruction(objConsulta){
    if(objConsulta.Nombre == ''){
      objConsulta.Nombre = 'a';
    }
    if(objConsulta.Apellido == ''){
      objConsulta.Apellido = 'a';
    }      
    if(objConsulta.Correo == ''){
      objConsulta.Correo = 'a';
    }        
    if(objConsulta.Fecha1 == 0){
      objConsulta.Fecha1 = 0;
    }              
    if(objConsulta.Fecha2 == 0){
      objConsulta.Fecha2 = 0;
    }  
    if(objConsulta.Servicio == ''){
      objConsulta.Servicio = 'a';
    }                    
    if(objConsulta.Estado == ''){
      objConsulta.Estado = 'a';  
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
}


