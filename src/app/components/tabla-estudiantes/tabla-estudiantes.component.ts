import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { StudentAtentionService } from "../../service/student-atention.service";
import { StudentService } from "../../class/studentService";

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-tabla-estudiantes',
  templateUrl: './tabla-estudiantes.component.html',
  styleUrls: ['./tabla-estudiantes.component.scss']
})
export class TablaEstudiantesComponent implements OnInit {

  constructor(public studentAtentionService: StudentAtentionService, public dialog: MatDialog) { }

  atentions: StudentService[];


  displayedColumns = ["Cedula" ,'Nombre', 'Apellido', 'Correo', 'Fecha', 'Servicio', 'Estado', "star"];
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
        console.log(atention);
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

  deleteService(id) {
    this.studentAtentionService.deleteService(id)
      .subscribe(data => {
          if( data.n == 1){
            var cont = 0;
            this.atentions.forEach(element => {
              cont += 1;
              if(element._id == id){
                this.atentions.splice(cont,1);
              }
            });
            cont = 0;
          }
          this.dataSource = new MatTableDataSource(this.atentions);
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(confirmDialog, {
      width: '250px',
      data: {id: this.atentions._id}
    });
  }
}

@Component({
  selector: 'confirmDialog',
  templateUrl: './confirmDialog.html',
})

export class confirmDialog {

  constructor(
    public dialogRef: MatDialogRef<confirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}