import { Component } from '@angular/core';

@Component({
  selector: 'buo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Birmingham Urban Observatory';

  public navOpen = false;

  toggle() {
    console.log('toggled')
    this.navOpen = !this.navOpen;
  }

}
