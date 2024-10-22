import {Component, EventEmitter, Input, input, Output} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {GraphService} from "../../services/graph.service";

@Component({
  selector: 'app-warning-dialog-component',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './warning-dialog-component.component.html',
  styleUrl: './warning-dialog-component.component.css'
})
export class WarningDialogComponentComponent {

  @Input() threadID!: string; // Use @Input to accept threadID
  @Output() deleteThreadEmitter = new EventEmitter<boolean>();

  constructor(private graphService: GraphService, private dialogRef: MatDialogRef<WarningDialogComponentComponent>) {
  }


  onCloseNo(): void {
    this.dialogRef.close();
  }

  onCloseYes(){
    console.log("ON CLOSE YES")
    this.deleteThreadEmitter.emit(true);
    this.dialogRef.close();
  }

}
