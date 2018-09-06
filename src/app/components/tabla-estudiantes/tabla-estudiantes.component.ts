import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {Observable}from 'rxjs/Observable';


import { StudentAtentionService } from "../../service/student-atention.service";
import { StudentService } from "../../class/studentService";

@Component({
  selector: 'app-tabla-estudiantes',
  templateUrl: './tabla-estudiantes.component.html',
  styleUrls: ['./tabla-estudiantes.component.scss']
})
export class TablaEstudiantesComponent implements OnInit {

  constructor(public studentAtentionService: StudentAtentionService) { }

  atentions: StudentService[];

  displayedColumns = ['Nombre', 'Apellido', 'Correo', 'Fecha', 'Servicio', 'Estado'];
  dataSource = new MatTableDataSource();

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngOnInit() {
    this.getService();
  }

  getService(): void{
    this.studentAtentionService.getService()
      .subscribe(atention => {
        this.atentions = this.changeEpochDate(atention);
        //console.log(atention);
        this.dataSource = new MatTableDataSource(this.atentions);
      });
  }

  changeEpochDate(pDbJSON): StudentService[]{
    var result: StudentService[];
    var aux: StudentService[] = pDbJSON;
    for (var item of pDbJSON){
      var myDate = new Date( item.Fecha *1000);
      item.Fecha = myDate.toLocaleString();
    }
    return result = pDbJSON;
  }
}

