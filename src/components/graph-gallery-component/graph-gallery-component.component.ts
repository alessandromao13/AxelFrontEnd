import {Component, OnInit} from '@angular/core';
import {Location, NgClass, NgForOf, NgIf} from "@angular/common";
import {GraphService} from "../../services/graph.service";
import {FormsModule} from "@angular/forms";
import {kg} from "../../modules/Graph";
import {D3GraphComponent} from "../d3-graph/d3-graph.component";
import {NavBarComponent} from "../nav-bar/nav-bar.component";
import {LoadingComponent} from "../loading/loading.component";
import {User} from "../../modules/User";
import {UserDocument} from "../../modules/Document";
import {PdfRenderComponent} from "../pdf-render/pdf-render.component";
import {PdfResponse} from "../../modules/PdfResponse";
import {WarningDialogComponentComponent} from "../warning-dialog-component/warning-dialog-component.component";
import {MatDialog} from "@angular/material/dialog";


@Component({
    selector: 'app-graph-gallery-component',
    standalone: true,
    imports: [
        FormsModule,
        NgForOf,
        NgIf,
        D3GraphComponent,
        NgClass,
        NavBarComponent,
        LoadingComponent,
        PdfRenderComponent
    ],
    templateUrl: './graph-gallery-component.component.html',
    styleUrl: './graph-gallery-component.component.css'
})
export class GraphGalleryComponentComponent implements OnInit {

    gotUserGraphs: kg[] = []
    gotUserDocuments: UserDocument[] = []
    selectedDocument: UserDocument = new UserDocument()
    visualizeGraph = false
    visualizeDocument = false
    selectedGraphId = ""
    loading = false
    selectedGraph: kg | undefined = undefined
    mostUsedNode: string = ""
    myUser: User = new User()
    documentsTab: boolean = false

    constructor(private location: Location, private graphService: GraphService, private dialog: MatDialog) {
    }

    ngOnInit() {
        this.loading = true
        this.getUserDocuments()
        this.getUserGraphs()
    }

    getUserDocuments() {
        this.graphService.getUserDocumentsByUseId(this.myUser.user_id).subscribe((data) => {
            // console.log("GOT DOCUMENTS", data)
            this.gotUserDocuments = data
            this.loading = false
        });
    }

    getUserGraphs() {
        this.graphService.getGraphsByUserId(this.myUser.user_id).subscribe((data) => {
            this.gotUserGraphs = data
            // console.log("GOT GRAPHS", this.gotUserGraphs)
            this.loading = false
        });
    }

    closeGraph() {
        this.visualizeGraph = false
    }


    logMe(from: string, data: any) {
    }

    goBack() {
        this.location.back();
    }

    openGraph(graphId: string) {
        // console.log("GOT GRAPH TO OPEN", graphId)
        this.visualizeGraph = true
        this.selectedGraphId = graphId
        this.getGraphById(graphId)
    }

    openDocument(document: UserDocument) {
        this.selectedDocument = new UserDocument();
        this.selectedDocument.title = document.title;
        this.selectedDocument.rag_id = document.rag_id;
        this.selectedDocument.document_id = document.document_id;
        this.getUserPDF(document.document_id)
        // console.log("DOCUMENT ID", this.selectedDocument.document_id)
        // console.log("OPENING PDF", this.selectedDocument);
    }


    getUserPDF(document_id: any) {
        this.graphService.getUserPDF(this.myUser.user_id, document_id).subscribe((response: PdfResponse) => {
            this.selectedDocument.document = response.got_pdf;
            this.visualizeDocument = true;
        });
    }

    switchView(){
        this.documentsTab = !this.documentsTab
    }

    deleteDocument(documentId: any) {
        // console.log("Deleting document", documentId)
        this.openWarningDialog()
    }

    closeDocument(){
        this.visualizeDocument = !this.visualizeDocument
    }

    openWarningDialog(): void {
        // console.log("OPENING DOCUMENT DELETION DIALOG")
        const dialogRef = this.dialog.open(WarningDialogComponentComponent, {
            width: '400px',
            data: { threadID: "", deletionFileName: "Document", documentID: this.selectedDocument.document_id}
        });
        dialogRef.componentInstance.deleteDocumentEmitter.subscribe((shouldDelete: boolean) => {
            // console.log("SHOULD DELETE", shouldDelete)
            if (shouldDelete) {
                this.graphService.deleteDocument(this.myUser.user_id, this.selectedDocument.document_id).subscribe()
            }
            this.getUserDocuments()
            this.getUserGraphs()
            this.closeDocument()
        });
    }

    getGraphById(graphId: any) {
        this.selectedGraph = this.gotUserGraphs.find(g => g.graph_id === graphId)
        const mostUsedNodeResult = this.getMostUsedNodes(this.selectedGraph)
        if (mostUsedNodeResult == undefined) {
            this.mostUsedNode = "No information so far"
        } else {
            this.mostUsedNode =  mostUsedNodeResult['head'] + " and " + mostUsedNodeResult['tail']
        }
    }


    getMostUsedNodes(selectedGraph: kg | undefined){
        if (selectedGraph !== undefined) {
            const result = this.getMaxUsageRelation(selectedGraph)
            // console.log(result)
            return result
        } else {
            return undefined
        }
    }

    getMaxUsageRelation(graph: kg): any | null {
        const validRelations = graph.relations.filter(relation => relation.usage_weight !== null);

        if (validRelations.length === 0) {
            return null;
        }

        return validRelations.reduce((max, relation) => {
            return (relation.usage_weight! > max.usage_weight!) ? relation : max;
        });
    }
}
