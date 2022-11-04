import { Component, OnInit } from '@angular/core';
import { Docente } from 'src/app/models/docente.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { DocenteService } from 'src/app/services/docente.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-crud-docente',
  templateUrl: './crud-docente.component.html',
  styleUrls: ['./crud-docente.component.css']
})
export class CrudDocenteComponent implements OnInit {

  //Para la Grilla
   docentes: Docente [] = [];
   filtro: string ="";
 
   //Para el ubigeo
   departamentos: string[] = [];;
   provincias: string[] = [];;
   distritos: Ubigeo[] = [];;

   
  //Json para registrar o actualizar
  docente: Docente = { 
    idDocente:0,
    nombre:"",
    dni:"",
    estado:1,
    ubigeo:{
      idUbigeo: -1,
      departamento:"-1",
      provincia:"-1",
      distrito:"-1",
    }
  };

  constructor(private docenteService:DocenteService, private ubigeoService:UbigeoService) {
      this.ubigeoService.listarDepartamento().subscribe(
          response => this.departamentos = response
      );            
  }

  cargaProvincia(){
      this.ubigeoService.listaProvincias(this.docente.ubigeo?.departamento).subscribe(
        response =>  this.provincias= response
      );

      this.docente.ubigeo!.provincia ="-1";
      this.distritos = [];  
      this.docente.ubigeo!.idUbigeo =-1;
  }

  cargaDistrito(){
      this.ubigeoService.listaDistritos(this.docente.ubigeo?.departamento, this.docente.ubigeo?.provincia).subscribe(
        response =>  this.distritos= response
      );

      this.docente.ubigeo!.idUbigeo =-1;
   }

  ngOnInit(): void {
  }

  consulta(){
     console.log(">>> consulta >> " + this.filtro);
      this.docenteService.consultaDocente(this.filtro==""?"todos":this.filtro).subscribe(
          x => this.docentes = x
      )
  }

  registra(){
      console.log(">>> registra >> ");
      this.docenteService.registraDocente(this.docente).subscribe(
          x => Swal.fire('Mensaje', x.mensaje,'info')
      )
  }

  busca(obj: Docente){
      console.log(">>> busca >> " + obj.idDocente);
      this.docente = obj;
      
      this.ubigeoService.listaProvincias(this.docente.ubigeo?.departamento).subscribe(
        response =>  this.provincias= response
      );

      this.ubigeoService.listaDistritos(this.docente.ubigeo?.departamento, this.docente.ubigeo?.provincia).subscribe(
        response =>  this.distritos= response
       );
  }

  cambiaEstado(obj:Docente){
      obj.estado =  obj.estado == 1 ? 0 : 1;
      this.docenteService.actualizaDocente(obj).subscribe();
  }

  actualiza(){
      console.log(">>> actualiza >> ");
      this.docenteService.actualizaDocente(this.docente).subscribe(
          x => Swal.fire('Mensaje', x.mensaje,'info')
      )
  }

  elimina(obj :Docente){
    console.log(">>> elimina >> ");
    
    Swal.fire({
      title: 'Mensaje',
      text: "¿Desea eliminar?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, elimine',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
            this.docenteService.eliminaDocente(obj.idDocente || 0).subscribe();
      }
    })

    
}

}
