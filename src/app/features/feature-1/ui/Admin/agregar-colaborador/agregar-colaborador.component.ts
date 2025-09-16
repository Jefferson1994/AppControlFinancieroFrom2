import { Component, OnInit, ChangeDetectionStrategy, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { buscarUserUseCase } from '../../../../feature-1/domain/use-cases/use-caseUsuario/userBusca.use-case';
import { agregarColaboradorServicesUseCase } from '../../../../feature-1/domain/use-cases/empresa-caseEmpresa/agregarColaborador.Servicio.use.case';
import { AuthService } from '../../../services/auth.service';
import { AgregarColaboradorDTO } from '../../../domain/models/empresa.models';

@Component({
  selector: 'app-agregar-colaborador',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './agregar-colaborador.component.html',
  styleUrl: './agregar-colaborador.component.css'
})
export class AgregarColaboradorComponent implements OnInit {

  @Input() idEmpresa: number | undefined;
  @Input() nombreEmpresa: string | undefined;
  @Output() modalClosed = new EventEmitter<void>();

  constructor(
      private buscarUserUseCase: buscarUserUseCase,
      private authService: AuthService,
      private router: Router,
      private agregarColaboradorServicesUseCase : agregarColaboradorServicesUseCase,
    ) {}

  // ✅ Objeto para el formulario
  cedulaData = signal<any>({ cedula: '' });
  colaboradorData = signal<any>({
    cedula: '',
    nombre: '',
    correo: '',
    numero_telefono: '',
    numero_identificacion: '',
    id_negocio: null,
    codigo_punto_emision_movil: ''
  });

  // ✅ Estado para controlar la habilitación de los campos
  camposBloqueados = signal<boolean>(true);
  desbloquepunto = signal<boolean>(true);
  ngOnInit(): void {
    if (this.idEmpresa) {
      this.colaboradorData.update(data => ({ ...data, id_negocio: this.idEmpresa }));
      console.log('Agregando colaborador a la empresa:', this.nombreEmpresa, 'con ID:', this.idEmpresa);
    }
  }

  async onBuscarColaborador(): Promise<void> {
    // ✅ Usa una variable local para obtener el valor de la señal
    const cedula = this.cedulaData().cedula;

    // ✅ Agrega una validación para asegurarte de que la cédula exista y tenga el largo correcto
    if (!cedula || cedula.length !== 10) {
      this.colaboradorData.set(null); // Limpia los datos si la cédula es inválida
      this.camposBloqueados.set(false); // Desbloquea los campos para que se puedan editar
      return; // Detiene la ejecución del método
    }

    // ✅ Ya no necesitas esta línea, ya que la validación anterior lo maneja
    // this.camposBloqueados.set(false);

    try {
      console.log('Buscando colaborador con cédula:', cedula);
      const userCredentials = { cedula: cedula };
      const respuesta = await this.buscarUserUseCase.execute(userCredentials);
      console.log('la respues de consulta',JSON.stringify(respuesta))

      if (respuesta && respuesta) {
        this.colaboradorData.set(respuesta);
        this.camposBloqueados.set(true); // Bloquea los campos si se encuentra al colaborador
        this.desbloquepunto.set(false);
      } else {
        console.log('No se encontró un colaborador con esa cédula.');
        this.colaboradorData.set(null);
        this.camposBloqueados.set(false); // Desbloquea los campos para que se puedan editar
        this.desbloquepunto.set(true);
      }
    } catch (error) {
      console.error('Error al buscar colaborador:', error);
      this.colaboradorData.set(null);
      this.camposBloqueados.set(false); // Desbloquea los campos en caso de error
      this.desbloquepunto.set(true);
    }
  }

  async onAgregarColaborador(): Promise<void> {
    const colaborador = this.colaboradorData();
    if (!this.idEmpresa || !colaborador.id || !colaborador.codigo_punto_emision_movil) {
      console.error('Datos incompletos para agregar el colaborador.');
      return;
    }

    // ✅ Se crea el DTO con los datos del formulario y del componente
    const datosParaAPI: AgregarColaboradorDTO = {
      id_negocio: this.idEmpresa,
      id_usuario: colaborador.id,
      codigo_punto_emision_movil: colaborador.codigo_punto_emision_movil,
    };

    try {
      // ✅ Se llama al caso de uso para enviar la data
      const respuesta = await this.agregarColaboradorServicesUseCase.execute(datosParaAPI);
      console.log('Colaborador agregado exitosamente:', respuesta);
      this.closeModal();
    } catch (error) {
      console.error('Error al agregar el colaborador:', error);
    }
  }

  onCancel(): void {
    this.closeModal();
  }

  closeModal(): void {
    this.modalClosed.emit();
  }
}


