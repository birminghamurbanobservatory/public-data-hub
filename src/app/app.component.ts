import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'buo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  public version = environment.version;

}
