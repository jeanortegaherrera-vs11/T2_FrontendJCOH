import { Component, inject, OnInit, signal } from '@angular/core';
import { AlumnoService } from '../../services/alumno';
import { Alumno } from '../../models/alumno';

@Component({
  selector: 'app-alumno-list',
  imports: [],
  templateUrl: './alumno-list.html',
  styleUrl: './alumno-list.scss'
})
export class AlumnoList implements OnInit {
  private alumnoService = inject(AlumnoService);
  alumnos = signal<Alumno[]>([]);
  error = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.alumnoService.listar().subscribe({
      next: (data) => {
        this.alumnos.set(data);
        this.error.set('');
      },
      error: () => this.error.set('No se pudo conectar con el servidor. Verifique que el backend esté encendido.')
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que desea eliminar este alumno?')) {
      return;
    }
    this.alumnoService.eliminar(id).subscribe({
      next: () => this.alumnos.update((lista) => lista.filter((a) => a.id !== id)),
      error: () => this.error.set('No se pudo eliminar el alumno.')
    });
  }
}
