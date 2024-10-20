import { Component } from '@angular/core';
import {SidebarComponentComponent} from "../sidebar-component/sidebar-component.component";
import {AppComponent} from "../../app/app.component";
import {NavBarComponent} from "../nav-bar/nav-bar.component";

@Component({
  selector: 'app-welcome-page',
  standalone: true,
    imports: [
        SidebarComponentComponent,
        AppComponent,
        NavBarComponent
    ],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css'
})
export class WelcomePageComponent {

}
