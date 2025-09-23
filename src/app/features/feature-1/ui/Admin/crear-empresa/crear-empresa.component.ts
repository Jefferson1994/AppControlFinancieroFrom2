import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CrearEmpresaDTO, CrearEmpresaResponse } from '../../../domain/models/empresa.models';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { crearEmpresasUseCase } from '../../../../feature-1/domain/use-cases/empresa-caseEmpresa/crearEmpresa.use.case';
import { ComponentMapaRegistroComponent } from "../component-mapa-registro/component-mapa-registro.component";

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
    address: string;
  } = {
    lat: 0,
    lng: 0,
    canton: 'N/A',
    province: 'N/A',
    address: 'N/A'
  };

  constructor(
    private crearEmpresasUseCase: crearEmpresasUseCase,
    private authService: AuthService,
    private router: Router
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

    if (user && user.user && user.token) {
      // ✅ Combina los datos de ambos pasos en un solo objeto DTO
      const empresaParaCrear: CrearEmpresaDTO = {
        ...this.datosPrimerPaso, // Usa los datos guardados del primer paso
        datos_contacto: formValue.datos_contacto, // Usa los datos del segundo paso
      };

      console.log("Objeto final para enviar:", JSON.stringify(empresaParaCrear));

      try {
        const respuesta = await this.crearEmpresasUseCase.execute(empresaParaCrear);
        console.log('Empresa creada:', respuesta);
        this.router.navigate(['/admin-dashboard/empresalist']);
      } catch (error) {
        console.error('Error al crear la empresa:', error);
      }
    } else {
      console.error('No se pudo enviar el formulario: usuario no autenticado.');
    }
  }

   onLocationSelected(locationData: { lat: number; lng: number; canton: string; province: string; address: string }) {
    this.selectedLocation = locationData;
    console.log('Selected Location:', this.selectedLocation);
  }
}
