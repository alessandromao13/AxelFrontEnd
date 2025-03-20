// import {Component, Input} from '@angular/core';
// import {finalize, Subscription} from "rxjs";
// import {HttpClient, HttpEventType} from "@angular/common/http";
// import {MatIcon} from "@angular/material/icon";
// import {MatProgressBar} from "@angular/material/progress-bar";
// import {NgIf} from "@angular/common";
//
// @Component({
//     selector: 'app-file-upload-component',
//     standalone: true,
//     imports: [
//         MatIcon,
//         MatProgressBar,
//         NgIf
//     ],
//     templateUrl: './file-upload-component.component.html',
//     styleUrl: './file-upload-component.component.css'
// })
// export class FileUploadComponentComponent {
//
//     @Input() requiredFileType: string = "pdf";
//
//     fileName = '';
//     uploadProgress: number | null = 0;
//     uploadSub: Subscription = new Subscription();
//
//     constructor(private http: HttpClient) {
//     }
//
//     onFileSelected(event: any) {
//         const file: File = event.target.files[0];
//
//         if (file) {
//             this.fileName = file.name;
//             const formData = new FormData();
//             formData.append("thumbnail", file);
//             console.log("GOT FILE", file)
//             const upload$ = this.http.post("/api/thumbnail-upload", formData, {
//                 reportProgress: true,
//                 observe: 'events'
//             })
//                 .pipe(
//                     finalize(() => this.reset())
//                 );
//
//             // this.uploadSub = upload$.subscribe(event => {
//             //     if (event !== undefined) {
//             //         if (event.type == HttpEventType.UploadProgress) {
//             //             this.uploadProgress = Math.round(100 * (event.loaded / event.total));
//             //         }
//             //     }
//             // })
//         }
//     }
//
//     cancelUpload() {
//         this.uploadSub.unsubscribe();
//         this.reset();
//     }
//
//     reset() {
//         this.uploadProgress = null;
//         this.uploadSub = new Subscription();
//     }
//
// }
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {finalize, Subscription} from "rxjs";
import {HttpClient, HttpEventType} from "@angular/common/http";
import {MatIcon} from "@angular/material/icon";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-file-upload-component',
    standalone: true,
    imports: [
        MatIcon,
        MatProgressBar,
        NgIf
    ],
    templateUrl: './file-upload-component.component.html',
    styleUrls: ['./file-upload-component.component.css']
})
export class FileUploadComponentComponent {

    @Output() uploadedFileEmitter = new EventEmitter<File>();
    requiredFileType: string = "pdf";
    fileName = '';
    fileUploaded: boolean = false;
    file: File | undefined = undefined;
    constructor() {}

    onFileSelected(event: any) {
        this.file = event.target.files[0]
        if (this.file && this.file.type === 'application/pdf') {
            this.fileName = this.file.name
            const formData = new FormData()
            formData.append("file", this.file)
            // console.log("Selected PDF file:", this.file)
            this.uploadedFileEmitter.emit(this.file)
            this.fileUploaded = true
        } else {
            alert("Please upload a valid PDF file.")
        }
    }

    removeFile(){
        this.fileUploaded = false;
        this.file = undefined
        this.fileName = ""
    }
}
