import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {GraphService} from "../../services/graph.service";
import {GraphEdge, GraphNode, kg} from "../../modules/Graph";
import {SearchBarComponent} from "../search-bar/search-bar.component";
import {GraphCardComponent} from "../graph-card/graph-card.component";
import {D3GraphComponent} from "../d3-graph/d3-graph.component";
import {User} from "../../modules/User";
import {FormsModule} from "@angular/forms";
import {Message} from "../../modules/Messages";
import {NavBarComponent} from "../nav-bar/nav-bar.component";
import {Thread} from "../../modules/Thread";
import {MatDialog} from "@angular/material/dialog";
import {WarningDialogComponentComponent} from "../warning-dialog-component/warning-dialog-component.component";
import {UserDocument} from "../../modules/Document";
import {PdfRenderComponent} from "../pdf-render/pdf-render.component";
import {PdfResponse} from "../../modules/PdfResponse";

@Component({
    selector: 'app-chat-component',
    standalone: true,
    imports: [
        SearchBarComponent,
        NgForOf,
        GraphCardComponent,
        NgIf,
        D3GraphComponent,
        FormsModule,
        NgClass,
        NavBarComponent,
        PdfRenderComponent
    ],
    templateUrl: './chat-component.component.html',
    styleUrl: './chat-component.component.css'
})
export class ChatComponentComponent implements OnInit, AfterViewChecked {
    showGraphToUse = false
    showThreadsList = true
    graphToUse: kg | undefined
    myUser: User = new User()
    inputField: string = ""
    userMessage: Message = new Message()
    usedGraphId: string = ""
    llmRes: Message = new Message("BOT", "")
    gotContext: string = ""
    visitedNodes: GraphNode[] = []
    visitedEdges: GraphEdge[] = []
    gotUserGraphs: kg[] = []
    gotUserDocuments: UserDocument[] = []
    threadMessages: Message[] = []
    gotUserThreads: Thread[] = []
    visualizeGraph = false
    visualizeDocument = false
    selectedDocument: UserDocument = new UserDocument()
    selectedGraphId: string = ""
    selectedGraph: kg | undefined = undefined
    selectedThread: Thread | undefined = undefined
    thread_id: string = ""
    disableInput: boolean  = false
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
    @ViewChild('messageListContainer') messageListContainer!: ElementRef;

    constructor(private graphService: GraphService, private dialog: MatDialog) {
    }

    ngOnInit() {
        this.graphService.getGraphsByUserId(this.myUser.user_id).subscribe((data) => {
            this.gotUserGraphs = data
        });
        this.graphService.getUserDocumentsByUseId(this.myUser.user_id).subscribe((data) => {
            this.gotUserDocuments = data
        });
        this.getUserThreads()
    }

    getUserThreads() {
        this.graphService.getThreadsByUserId(this.myUser.user_id).subscribe((data) => {
            this.gotUserThreads = data
        });
    }

    openUserGraph(graph_id: string) {
        this.visualizeGraph = true
        this.selectedGraphId = graph_id
        this.selectedGraph = this.gotUserGraphs.find(g => g.graph_id === graph_id)
    }

    openUserDocument(document: UserDocument) {
        // todo
        this.selectedDocument = new UserDocument();
        this.selectedDocument.title = document.title;
        this.selectedDocument.rag_id = document.rag_id;
        this.selectedDocument.document_id = document.document_id;
        this.getUserPDF(document.document_id)
    }


    getUserPDF(document_id: any) {
        this.graphService.getUserPDF(this.myUser.user_id, document_id).subscribe((response: PdfResponse) => {
            this.selectedDocument.document = response.got_pdf;
            this.visualizeDocument = true;
        });
    }

    closeGraph() {
        this.visualizeGraph = false
    }

    closeDocument() {
        this.visualizeDocument = false
    }


    showUserMessages(event: any) {
        this.selectedThread = this.gotUserThreads.find(t => t.thread_id === event)
        this.thread_id = event.thread_id
        for (let i = 0; i < this.gotUserThreads.length; i++) {
            const thread = this.gotUserThreads[i];
            if (thread.thread_id == event) {
                this.threadMessages = thread.messages;
            }
        }
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            const container = this.messageListContainer.nativeElement;
            container.scrollTop = container.scrollHeight;
        } catch (err) {
            console.error('Failed to scroll to the bottom', err);
        }
    }


    pushMessage(message: Message) {
        this.threadMessages.push(message)
    }


    showContext(gotContext: string) {
        this.gotContext = gotContext;
    }

    updateGraphView(visitedNodes: GraphNode[], visitedEdges: GraphEdge[]) {
        console.log("+++ USED NODES", visitedNodes)
        console.log("+++ USED EDGES", visitedEdges)
    }


    sendMessage() {
        if (this.inputField.length > 0) {
            console.log("SENDING MESSAGE VALUES",
                "GRAPH ID", this.usedGraphId,
                "USER MESSAGE", this.userMessage.content = this.inputField,
            )
            this.pushMessage(new Message("USER", this.userMessage.content))
            this.inputField = ""
            this.graphService.executeChatSystem(this.userMessage.content, this.selectedGraphId, this.selectedDocument.rag_id, "1234", this.selectedThread?.thread_id).subscribe((data) => {
                if (this.selectedThread == undefined) {
                    this.selectedThread = new Thread()
                    this.selectedThread.thread_id = data.thread_id
                }
                this.llmRes.content = data.llm_res;
                this.gotContext = data.context;
                this.visitedNodes = data.nodes;
                this.visitedEdges = data.edges
                this.pushMessage(new Message("BOT", this.llmRes.content))
                this.showContext(this.gotContext)
                this.updateGraphView(this.visitedNodes, this.visitedEdges)
                this.disableInput = false
            });
        }
    }

    changeTab() {
        this.showThreadsList = !this.showThreadsList
        this.selectedThread = undefined
        this.visualizeDocument = false
        this.visualizeGraph = false
        this.newThread()
        this.getUserThreads()
    }

    newThread() {
        this.threadMessages = []
        this.inputField = ""
        this.selectedGraphId = ""
        this.selectedDocument = new UserDocument()
        this.selectedGraph = undefined
        this.graphService.getNewThreadID().subscribe((data) => {
            this.thread_id = data
        });
        this.selectedThread = new Thread()
        this.selectedThread.thread_id = this.thread_id;
    }

    deleteThread() {
        this.openWarningDialog()
    }

    openWarningDialog(): void {
        const dialogRef = this.dialog.open(WarningDialogComponentComponent, {
            width: '400px',
            data: { threadID: this.selectedThread?.thread_id, deletionFileName: "Thread", documentID: ""}
        });
        dialogRef.componentInstance.deleteThreadEmitter.subscribe((shouldDelete: boolean) => {
            if (shouldDelete) {
                if (this.selectedThread) {
                    this.graphService.deleteChat(this.selectedThread.thread_id).subscribe()
                } else {
                    this.graphService.deleteChat(this.thread_id).subscribe()
                }
                this.changeTab()
                this.getUserThreads()
            }
        });
    }
}
