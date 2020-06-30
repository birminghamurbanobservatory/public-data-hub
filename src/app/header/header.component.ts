import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'buo-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  public mobileOpen: Boolean = false;

  toggleNav() {
    this.mobileOpen = !this.mobileOpen;
  }

}
