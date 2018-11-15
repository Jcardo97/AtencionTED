import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders}from '@angular/common/http';
import 'rxjs/Rx';
import {Observable}from 'rxjs/Observable';
import { catchError, map, tap}from 'rxjs/operators';
import {of}from 'rxjs/observable/of';


import { StudentService } from "../class/studentService";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable()
export class StudentAtentionService {

  domain: string = "http://localhost:3000"

  constructor(private http: HttpClient) { }

  getService(){
    return this.http.get<StudentService[]>(`${this.domain}/api/tasks`)
      .map(res => res);
  }

  getServiceDate(_pNombre, _pApellido, _pCorreo, _pFecha1, _pFecha2, _pServicio, _pEstado){
    return this.http.get<StudentService[]>(`${this.domain}/api/tasks/${_pNombre}/${_pApellido}/${_pCorreo}/${_pFecha1}/${_pFecha2}/${_pServicio}/${_pEstado}`,)
    .map(res => res);
  }
 
  addService(newStudentAtention: StudentService) {
    return this.http.post<StudentService>(`${this.domain}/api/tasks`, newStudentAtention)
      .map(res => res);
  }

  deleteService(id) {
    return this.http.delete<StudentService>(`${this.domain}/api/tasks/${id}`)
     .map(res => res);
  }

  updateService(newStudentAtention) {
    return this.http.put(`${this.domain}/api/tasks/${newStudentAtention.id}`, newStudentAtention)
      .map(res => res);
  }

}
