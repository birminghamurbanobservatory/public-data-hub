import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'buo-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public navDroppedDown = false;

  toggleNavDropdown() {
    this.navDroppedDown = !this.navDroppedDown;
  }

}
