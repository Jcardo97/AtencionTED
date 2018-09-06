export class StudentService{
     _id?: string;
     Nombre: string;
     Apellido: string;
     Correo: string;
     Fecha: number;
     Servicio: string;
     Estado: string;
     isDone: boolean;
     n?: number;

}

export interface StudentService{
    Nombre: string;
    Apellido: string;
    Correo: string;
    Fecha: number;
    Servicio: string;
    Estado: string;
}
