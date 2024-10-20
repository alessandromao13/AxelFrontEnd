import {Component, OnInit} from '@angular/core';
import {NavBarComponent} from "../nav-bar/nav-bar.component";
import {CreateGraphComponent} from "../create-graph/create-graph.component";
import {DragAndDropComponent} from "../drag-and-drop/drag-and-drop.component";
import {NgClass, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {GraphService} from "../../services/graph.service";
import {MatDialog} from "@angular/material/dialog";
import {User} from "../../modules/User";
import {GraphCreatedDialogComponent} from "../graph-created-dialog/graph-created-dialog.component";

@Component({
    selector: 'app-graph-creation-page',
    standalone: true,
    imports: [
        NavBarComponent,
        CreateGraphComponent,
        DragAndDropComponent,
        NgClass,
        FormsModule,
        NgIf
    ],
    templateUrl: './graph-creation-page.component.html',
    styleUrl: './graph-creation-page.component.css'
})
export class GraphCreationPageComponent implements OnInit {
    aiGeneration: boolean | undefined = true;
    summaryTextInput: string = ""
    titleTextInput: string = ""
    infoTextInput: string = ""
    loading: boolean = false
    myUser: User = new User()

    constructor(private graphService: GraphService, private dialog: MatDialog) {
    }

    ngOnInit() {
    }

    enableAiGeneration(enable: boolean) {
        this.aiGeneration = enable
        this.titleTextInput = ""
        this.summaryTextInput = ""
        console.log("++ AI GENERATION IS ENABLED: ", this.aiGeneration)
    }

    checkCanGenerate() {
        if (this.aiGeneration) {
            return (this.titleTextInput == "" && this.summaryTextInput == "" && this.infoTextInput.length > 0)
        } else {
            return (this.titleTextInput.length > 0 && this.summaryTextInput.length > 0 && this.infoTextInput.length > 0)
        }
    }


    resetPage(){
        this.summaryTextInput = ""
        this.titleTextInput = ""
        this.infoTextInput = ""
        this.loading = false
    }

    generateGraph() {
        console.log("GENERATING GRAPH")
        this.loading = true
        if (this.aiGeneration) {
            this.summaryTextInput = ""
            this.titleTextInput = ""
        }
        // console.log("INPUTS")
        // console.log("Title", this.titleTextInput)
        // console.log("Summary", this.summaryTextInput)
        // console.log("testo", this.infoTextInput)
        //
        // this.graphService.generateGraph(this.myUser.user_id, this.titleTextInput, this.summaryTextInput, this.infoTextInput).subscribe(data => {
        //     this.openSuccessDialog();
        //     this.resetPage()
        // });

        setTimeout(() => {
            this.openSuccessDialog();
            this.resetPage();
        }, 5000);

        this.emptyFields()
    }

    openSuccessDialog(): void {
        this.dialog.open(GraphCreatedDialogComponent, {
            width: '400px',
        });
    }

    emptyFields(){
        this.infoTextInput = ""
        this.summaryTextInput = ""
        this.titleTextInput = ""
    }

    backToPageView(){
        this.loading = false
    }


    protected readonly undefined = undefined;
}
