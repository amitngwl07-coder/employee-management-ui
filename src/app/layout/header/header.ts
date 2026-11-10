import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly pageTitle = 'Dashboard';
  protected readonly userName = 'Admin User';
  protected readonly userRole = 'Administrator';
}