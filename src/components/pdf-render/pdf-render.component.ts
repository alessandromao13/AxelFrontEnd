// import {Component, Input, OnInit} from '@angular/core';
// import {UserDocument} from "../../modules/Document";
// import {NgIf} from "@angular/common";
// import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
//
// @Component({
//   selector: 'app-pdf-render',
//   standalone: true,
//   imports: [
//     NgIf
//   ],
//   templateUrl: './pdf-render.component.html',
//   styleUrl: './pdf-render.component.css'
// })
// export class PdfRenderComponent implements OnInit {
//
//   @Input() userDocument!: UserDocument;
//   pdfUrl: SafeResourceUrl | null = null;
//
//   // Inject DomSanitizer
//   constructor(private sanitizer: DomSanitizer) {}
//
//   ngOnInit() {
//     console.log("INIT", this.userDocument)
//   }
//
//   ngOnChanges() {
//     if (this.userDocument && this.userDocument.document) {
//       const pdfBlob = new Blob([this.userDocument.document], { type: 'application/pdf' });
//       const unsafeUrl = URL.createObjectURL(pdfBlob);
//
//       this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
//     }
//   }
//
//   ngOnDestroy() {
//     if (this.pdfUrl) {
//       URL.revokeObjectURL(this.pdfUrl as string);
//     }
//   }
//
// }
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { UserDocument } from "../../modules/Document";
import { NgIf } from "@angular/common";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: 'app-pdf-render',
  standalone: true,
  imports: [NgIf],
  templateUrl: './pdf-render.component.html',
  styleUrl: './pdf-render.component.css'
})
export class PdfRenderComponent implements OnInit, OnChanges {
  @Input() userDocument!: UserDocument;
  pdfUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    console.log("INIT", this.userDocument);
    this.createPdfUrl();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userDocument']) {
      this.createPdfUrl();
    }
  }

  private createPdfUrl() {
    if (this.userDocument?.document) {
      const pdfBlob = new Blob([this.userDocument.document], { type: 'application/pdf' });
      const unsafeUrl = URL.createObjectURL(pdfBlob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    }
  }

  ngOnDestroy() {
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl as string);
    }
  }
}
