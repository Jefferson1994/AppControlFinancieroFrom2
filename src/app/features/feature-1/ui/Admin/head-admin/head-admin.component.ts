import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-head-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './head-admin.component.html',
  styleUrls: ['./head-admin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadAdminComponent {

  constructor(private authService :AuthService){

  }
  adminName = signal('Admin');
  rol = signal('Admin');

  ngOnInit(): void {
    // ✅ Get the user's name from the AuthService and update the signal
    const user = this.authService.getCurrentUser();
    if (user && user.user && user.user.nombre) {
      this.adminName.set(user.user.nombre);
      //this.rol.set(user.user.id_rol.toString());
    }
  }



  @Output() toggleSidebarEvent = new EventEmitter<void>();

  profileMenuOpen = signal(false);

  toggleProfileMenu() {
    this.profileMenuOpen.update(value => !value);
  }
}
