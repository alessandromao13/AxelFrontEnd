import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  constructor(private router: Router) {
  }
  createNewGraph() {
    this.router.navigate(['/create-new-graph']);
  }

  openGraphs() {
    this.router.navigate(['/graph-gallery']);
  }

  openChat() {
    console.log("NAVIGATING TO CHAT")
    this.router.navigate(['/chat']);
  }

  goHome() {
    this.router.navigate(['']);
  }

  openTestGraph(){
    this.router.navigate(['/test-graph']);
  }


}
