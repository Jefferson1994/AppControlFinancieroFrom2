import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service'
import { ActualizarrEmpresaDTO, CrearEmpresaDTO, EmpresasInterfas } from '../../../domain/models/empresa.models';
import { EmpresasXIdUseCase } from '../../../../feature-1/domain/use-cases/empresa-caseEmpresa/empreXId.use.case';
import { LoadingService } from '../../../services/loading.service';
import { actualizarEmpresasUseCase } from '../../../../feature-1/domain/use-cases/empresa-caseEmpresa/actualizarEmpresa.use.case';
import { AlertService } from '../../../services/alert.service';
import { ComponentMapaRegistroComponent } from "../component-mapa-registro/component-mapa-registro.component";

@Component({
  selector: 'app-ver-empresa-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, ComponentMapaRegistroComponent],
  templateUrl: './ver-empresa-detalle.component.html',
  styleUrls: ['./ver-empresa-detalle.component.css']
})
export class VerEmpresaDetalleComponent implements OnInit {
  [x: string]: any;

  // ✅ Señal para controlar el modo de edición, inicia en 'false'
  modoEdicion = signal(false);
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  @ViewChild('fileInput') fileInput!: ElementRef;
  private originalEmpresa: EmpresasInterfas | null = null;
  nuevasImagenesParaSubir: File[] = [];
  nuevasImagenesPreview: string[] = [];
  // Arreglo para registrar los IDs de las imágenes existentes que se quieren eliminar
  imagenesParaEliminarIDs: number[] = [];

  constructor( private authService: AuthService, private obtenerEmpresasUseCase:EmpresasXIdUseCase,
    private actualizarEmpresaUseCase :actualizarEmpresasUseCase
  ){

  }

  // ✅ Datos de la empresa, simplemente inicializados, no se cargan de una API

  private route = inject(ActivatedRoute);


  empresa: EmpresasInterfas | null = null;
  empresa2: [EmpresasInterfas] | null = null;


  ngOnInit(): void {
    const idEmpresaStr = this.route.snapshot.paramMap.get('id_empresa');
    console.log("str ", idEmpresaStr);

    if (idEmpresaStr) {
      const idEmpresa = Number(idEmpresaStr);
      console.log("id de la empresa", idEmpresa);
      // ✅ Simplemente llamamos al método. Este se encargará del spinner.
      this.cargarDatosEmpresa(idEmpresa);
    } else {
      console.error("No se encontró un ID de empresa en la URL.");
      // ✅ Nos aseguramos de ocultar el spinner si no hay ID.
      this.loadingService.hide();
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFiles(input.files);
      input.value = '';
    }
  }

  private processFiles(files: FileList): void {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        this.nuevasImagenesParaSubir.push(file);

        const reader = new FileReader();
        reader.onload = (e: any) => this.nuevasImagenesPreview.push(e.target.result);
        reader.readAsDataURL(file);
      }
    });
  }

  eliminarImagenExistente(imagenAEliminar: any): void {
    if (this.empresa) {
      // 1. Añadimos el ID a la lista de "pendientes para eliminar"
      this.imagenesParaEliminarIDs.push(imagenAEliminar.id);

      // 2. La quitamos de la lista visible
      this.empresa.imagenes = this.empresa.imagenes.filter(img => img.id !== imagenAEliminar.id);
    }
  }

  eliminarNuevaImagen(index: number): void {
    // Simplemente la quitamos de los arreglos temporales
    this.nuevasImagenesParaSubir.splice(index, 1);
    this.nuevasImagenesPreview.splice(index, 1);
  }


  async cargarDatosEmpresa(idEmpresa : number): Promise<void> {
    try {
      this.loadingService.show();
      console.log('cargando empresas');


      // ✅ CORRECCIÓN: Llama al nuevo método público del servicio
      const userResponse = this.authService.getCurrentUser();

      // ❗ The logic to check if the user and ID exist remains the same
      if (userResponse && userResponse.user && userResponse.user.id) {
        const idAdministrador = userResponse.user.id;

        const response = await this.obtenerEmpresasUseCase.execute(idEmpresa);
        if (Array.isArray(response)) {
          this.empresa = response[0]
          console.log('Empresa cargada y asignada desde array:', JSON.stringify(this.empresa?.imagenes[0].url_imagen));
        } else {
          this.empresa = response;
        }
        console.log('Empresa cargada y asignada:', JSON.stringify(this.empresa?.imagenes[0].url_imagen));
          console.log(
            'PADRE: Coordenadas que se enviarán al mapa:',
            this.empresa?.datosContactoEmpresa.latitud,
            this.empresa?.datosContactoEmpresa.longitud
          );


      } else {
        console.error('User not logged in or ID not found.');
        // You should redirect the user to the login page here.
      }
    } catch (error) {
      console.error('Error al cargar las empresas:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  eliminarImagen(imagenAEliminar: any): void {
    // Nos aseguramos de que el objeto 'empresa' y su arreglo 'imagenes' existan
    if (this.empresa && this.empresa.imagenes) {
      // Creamos un nuevo arreglo que contiene todas las imágenes EXCEPTO la que queremos eliminar
      this.empresa.imagenes = this.empresa.imagenes.filter(
        (imagen: any) => imagen.id !== imagenAEliminar.id
      );
    }
  }


  // ✅ Invierte el valor de la señal `modoEdicion` al hacer clic en el checkbox
  toggleEditMode(): void {
    this.modoEdicion.update(value => !value);
  }

  async onSubmit(): Promise<void> {
    if (!this.empresa) {
      console.error('No hay empresa cargada.');
      return;
    }

    try {
      this.loadingService.show();

      // ✅ Construir DTO con los datos que se enviarán
      const empresaParaActualizar: ActualizarrEmpresaDTO = {
        nombre: this.empresa.nombre,
        descripcion: this.empresa.descripcion,
        id_tipo_empresa: this.empresa.tipoEmpresa.id, // asegurarse que solo mandas el id
        direccion: this.empresa.direccion,
        horario_apertura: this.empresa.horario_apertura,
        horario_cierre: this.empresa.horario_cierre,
        datos_contacto: {
          telefono_contacto: this.empresa.datosContactoEmpresa.telefono_contacto,
          email_contacto: this.empresa.datosContactoEmpresa.email_contacto,
          ciudad: "Quito",
          provincia: "Pichincha",
          pais: "Ecuador",
          latitud: -0.1807,
          longitud: -78.4678
        }
      };

      console.log('Enviando empresa a actualizar:', JSON.stringify(empresaParaActualizar));
      const idEmpresaStr = this.route.snapshot.paramMap.get('id_empresa');
      const idEmpresa = Number(this.route.snapshot.paramMap.get('id_empresa'));
      const respuesta = await this.actualizarEmpresaUseCase.execute(empresaParaActualizar,idEmpresa);

      console.log('Respuesta de actualización:', respuesta);

      // ✅ Feedback al usuario

      this.alertService.showSuccess('Empresa actualizada con éxito ');

      this.modoEdicion.set(false); // salir del modo edición

    } catch (error) {
      console.error('Error al actualizar la empresa:', error);
      this.alertService.showError('Error al actualizar la empresa  ');
    } finally {
      this.loadingService.hide();
    }
  }


  onCancel(): void {
    this.modoEdicion.set(false);
    this.empresa = JSON.parse(JSON.stringify(this.originalEmpresa));
    this.nuevasImagenesParaSubir = [];
    this.nuevasImagenesPreview = [];
    this.imagenesParaEliminarIDs = [];
  }

  onMapLocationChanged(newLocationData: any): void {
  // Verificamos que el objeto 'empresa' exista antes de modificarlo
  if (this.empresa) {
    console.log('Nuevos datos de ubicación recibidos desde el mapa:', newLocationData);

    // Actualizamos las propiedades del objeto 'empresa' con los nuevos valores
    this.empresa.datosContactoEmpresa.latitud = newLocationData.lat;
    this.empresa.datosContactoEmpresa.longitud = newLocationData.lng;
    this.empresa.datosContactoEmpresa.ciudad = newLocationData.canton;
    this.empresa.datosContactoEmpresa.provincia = newLocationData.province;

    // Si la dirección principal del negocio también debe actualizarse:
    this.empresa.direccion = newLocationData.direccionFisica;
  }
}
}
