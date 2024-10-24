import {Component, EventEmitter, Inject, Input, input, OnInit, Output} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
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
export class WarningDialogComponentComponent implements OnInit {

  @Input() threadID!: string
  @Input() documentID!: string
  @Input() deletionFileName!: string;
  @Output() deleteThreadEmitter = new EventEmitter<boolean>();
  @Output() deleteDocumentEmitter = new EventEmitter<boolean>();

  constructor(private dialogRef: MatDialogRef<WarningDialogComponentComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    // Assign the passed data to the input properties
    this.threadID = this.data.threadID;
    this.documentID = this.data.documentID;
    this.deletionFileName = this.data.deletionFileName;
    console.log("WARNGING COMPONENT GOT DELETION FILE NAME", this.deletionFileName)
    console.log("WARNGING COMPONENT GOT DELETION T ID", this.threadID)
    console.log("WARNGING COMPONENT GOT DELETION D ID", this.documentID)
  }


  onCloseNo(): void {
    this.dialogRef.close();
  }

  onCloseYes(){
    console.log("ON CLOSE YES")
    console.log("T ID IS EMPTY", this.threadID !== "")
    console.log("T ID IS NOT UND", this.threadID !== undefined)
    console.log("D ID IS EMPTY", this.documentID !== "")
    console.log("D ID IS NOT UND", this.documentID !== undefined)
    if (this.threadID !== ""){
      this.deleteThreadEmitter.emit(true);
    } else if (this.documentID !== "") {
      console.log("EMITTING")
      this.deleteDocumentEmitter.emit(true);
    }
    this.dialogRef.close();
  }

}
