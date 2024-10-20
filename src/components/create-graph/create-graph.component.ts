import { Component } from '@angular/core';
import {NavBarComponent} from "../nav-bar/nav-bar.component";

@Component({
  selector: 'app-create-graph',
  standalone: true,
  imports: [
    NavBarComponent
  ],
  templateUrl: './create-graph.component.html',
  styleUrl: './create-graph.component.css'
})
export class CreateGraphComponent {

}
