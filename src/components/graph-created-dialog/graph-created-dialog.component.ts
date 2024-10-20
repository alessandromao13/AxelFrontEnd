import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-graph-created-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatButton
  ],
  templateUrl: './graph-created-dialog.component.html',
  styleUrl: './graph-created-dialog.component.css'
})
export class GraphCreatedDialogComponent {
  constructor(private dialogRef: MatDialogRef<GraphCreatedDialogComponent>, private router: Router) {}

  onClose(): void {
    this.dialogRef.close();
  }

  navigateToGraphs(): void {
    this.router.navigate(['/graph-gallery']);
    this.onClose();
  }

}
