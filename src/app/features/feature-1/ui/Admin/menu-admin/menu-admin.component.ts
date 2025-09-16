// menu-admin.component.ts
import { Component, Input, Output, EventEmitter,HostBinding  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent {
  @Input() navItems: any[] = [];
  @Input() isOpen: boolean = false;
  @Input() currentView: string = '';
  @HostBinding('class.is-open') get opened() { return this.isOpen; }
  @HostBinding('class.is-closed') get closed() { return !this.isOpen; }

  @Output() viewSelected = new EventEmitter<string>();

  onViewSelected(viewName: string) {
    this.viewSelected.emit(viewName);
  }
}
