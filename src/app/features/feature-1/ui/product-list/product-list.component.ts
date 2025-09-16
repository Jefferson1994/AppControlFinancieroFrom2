import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: []

})
export class ProductListComponent implements OnInit {

  private readonly router = inject(Router);

  ngOnInit(): void {

  }

  redirigirALogin() {
    console.log("click en login")
    this.router.navigate(['/login']); // Navega a la ruta '/login'
  }



}
