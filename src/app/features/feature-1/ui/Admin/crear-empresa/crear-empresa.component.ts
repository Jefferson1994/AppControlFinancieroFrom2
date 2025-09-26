import { Component, ChangeDetectionStrategy, signal, ViewChild, ElementRef,ChangeDetectorRef, inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CrearEmpresaDTO, CrearEmpresaResponse } from '../../../domain/models/empresa.models';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { crearEmpresasUseCase } from '../../../../feature-1/domain/use-cases/empresa-caseEmpresa/crearEmpresa.use.case';
import { ComponentMapaRegistroComponent } from "../component-mapa-registro/component-mapa-registro.component";
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-crear-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule, ComponentMapaRegistroComponent],
  templateUrl: './crear-empresa.component.html',
  styleUrls: ['./crear-empresa.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearEmpresaComponent {

  selectedLocation: {
    lat: number;
    lng: number;
    canton: string;
    province: string;
    addressURl: string;
    country: string;
    direccionFisica: string;
  } = {
    lat: 0,
    lng: 0,
    canton: 'N/A',
    province: 'N/A',
    addressURl: 'N/A',
    country: 'N/A',
    direccionFisica: 'N/A'
  };

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // (NUEVO) Almacena los archivos de imagen seleccionados (los objetos File)
  selectedFiles: File[] = [];
  // (NUEVO) Almacena las URLs de las imágenes para la previsualización
  imagePreviews: string[] = [];
  isDragging = false;
  imagenes!: string[];
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  loading = true;

  constructor(
    private crearEmpresasUseCase: crearEmpresasUseCase,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  currentStep = signal<number>(1);

  // ✅ NUEVA PROPIEDAD para guardar los datos del primer paso
  private datosPrimerPaso: any = {};

  prevStep() {
    this.currentStep.update(step => step - 1);
  }

  // ✅ Método que guarda los datos y avanza
  nextStep(form: NgForm) {
    if (form.valid) {
      // Guarda solo los datos del ngModelGroup del primer paso
      this.datosPrimerPaso = form.value.informacion_general;

      this.currentStep.update(step => step + 1);
      console.log('Datos del Paso 1 guardados:', this.datosPrimerPaso);
    } else {
      console.log('El formulario del Paso 1 no es válido.');
    }
  }

  // ✅ Método para enviar el formulario final
  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.enviarFormulario(form.value);
    }
  }


  async enviarFormulario(formValue: any): Promise<void> {
    const user = this.authService.getCurrentUser();

    if (!user || !user.user || !user.token) {
      console.error('No se pudo enviar el formulario: usuario no autenticado.');
      return;
    }

    if (this.selectedFiles.length === 0) {

      console.error('Error: Debes subir al menos una imagen.');
      this.alertService.showError('Error: Debes subir al menos una imagen.');

      return;
    }
    if (this.selectedLocation.lat === 0 && this.selectedLocation.lng === 0) {
      console.error('Error: Debes seleccionar una ubicación en el mapa.');
      this.alertService.showError('Error: Debes seleccionar una ubicación en el mapa.');

      return;
    }


    const formData = new FormData();


    formData.append('nombre', this.datosPrimerPaso.nombre);
    formData.append('ruc', this.datosPrimerPaso.ruc);
    formData.append('descripcion', this.datosPrimerPaso.descripcion);
    formData.append('id_tipo_empresa', this.datosPrimerPaso.id_tipo_empresa.toString());
    formData.append('direccion', this.datosPrimerPaso.direccion);
    formData.append('horario_apertura', this.datosPrimerPaso.horario_apertura);
    formData.append('horario_cierre', this.datosPrimerPaso.horario_cierre);

    const datosContacto = {
      telefono_contacto: formValue.datos_contacto.telefono_contacto,
      email_contacto: formValue.datos_contacto.email_contacto,
      ciudad: this.selectedLocation.canton,
      provincia: this.selectedLocation.province,
      pais: this.selectedLocation.country,
      latitud: this.selectedLocation.lat,
      longitud: this.selectedLocation.lng,
      direccionUrl: this.selectedLocation.addressURl,
      direccionFisica: this.selectedLocation.direccionFisica,
    };
    formData.append('datos_contacto', JSON.stringify(datosContacto));


    this.selectedFiles.forEach(file => {
      formData.append('imagenes', file, file.name);
    });

    try {
      this.loading = true;      // <-- Inicia la carga del componente
      this.loadingService.show();
      console.log('Enviando FormData al backend...');

      //for (const [key, value] of formData.entries()) {
      //  console.log(`${key}:`, value);
      //}
      const respuesta = await this.crearEmpresasUseCase.execute(formData);

      this.router.navigate(['/admin-dashboard/empresalist']);

    } catch (error) {
      this.alertService.showError('Error al crear la empresa:');
      console.error('Error al crear la empresa:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }finally{
      this.loading = false;
      this.loadingService.hide();
    }
  }

  onLocationSelected(locationData: { lat: number; lng: number; canton: string; province: string; address: string , addressURl: string, country: string, direccionFisica: string}): void {
    this.selectedLocation = locationData;
    console.log('Selected Location:', this.selectedLocation);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }


  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFiles(files);
    }
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
      if (this.selectedFiles.length < 4 && file.type.startsWith('image/')) {
        this.selectedFiles.push(file);
        this.previewImage(file);
      }
    });
  }

  private previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviews.push(reader.result as string);
      this.cd.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }
}
