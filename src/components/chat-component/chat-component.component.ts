import {AfterViewChecked, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Location, NgClass, NgForOf, NgIf} from "@angular/common";
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
import {GraphCreatedDialogComponent} from "../graph-created-dialog/graph-created-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {WarningDialogComponentComponent} from "../warning-dialog-component/warning-dialog-component.component";

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
        NavBarComponent
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
    messages: Message[] = []
    threadMessages: Message[] = []
    gotUserThreads: Thread[] = []
    visualizeGraph = false
    selectedGraphId: string = ""
    selectedGraph: kg | undefined = undefined
    selectedThread: Thread | undefined = undefined
    thread_id: string = ""
    disableInput: boolean  = false
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    // ViewChild to reference the message-list container
    @ViewChild('messageListContainer') messageListContainer!: ElementRef;


    constructor(private graphService: GraphService, private dialog: MatDialog) {
    }

    ngOnInit() {
        console.log("ON INIT GETTING GRAPHS")

        this.graphService.getGraphsByUserId(this.myUser.user_id).subscribe((data) => {
            this.gotUserGraphs = data
            console.log("got graphs", data)
        });
        console.log("ON INIT GETTING THREADS")
        this.getUserThreads()
    }

    getUserThreads() {
        this.graphService.getThreadsByUserId(this.myUser.user_id).subscribe((data) => {
            this.gotUserThreads = data
            console.log("got threads", data)
        });

    }

    openUserGraph(graph_id: string) {
        this.visualizeGraph = true
        this.selectedGraphId = graph_id
        this.selectedGraph = this.gotUserGraphs.find(g => g.graph_id === graph_id)
        console.log("VISUALIZE GRAPH", graph_id)
    }

    closeGraph() {
        this.visualizeGraph = false
    }


    showUserMessages(event: any) {
        console.log("GOT THREAD ID", event)
        this.selectedThread = this.gotUserThreads.find(t => t.thread_id === event)
        this.thread_id = event.thread_id
        for (let i = 0; i < this.gotUserThreads.length; i++) {
            const thread = this.gotUserThreads[i];
            if (thread.thread_id == event) {
                this.threadMessages = thread.messages;
                console.log("GOT THREAD MESSAGES", this.threadMessages)
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
        this.disableInput = true
        if (this.inputField.length > 0) {
            console.log("SENDING MESSAGE VALUES",
                "GRAPH ID", this.usedGraphId,
                "USER MESSAGE", this.userMessage.content = this.inputField,
            )
            this.pushMessage(new Message("USER", this.userMessage.content))
            console.log("Selected GRaph id", this.selectedGraphId)
            this.inputField = ""
            console.log("sending message", this.thread_id, this.selectedThread?.usedGraphId)
            console.log("USER MESSAGE", this.userMessage.content)
            // this.pushMessage(new Message("USER", this.userMessage.content))
            // todo decommentare per chattare effettivamente
            this.graphService.executeChatSystem(this.userMessage.content, this.selectedGraphId, "1234", this.selectedThread?.thread_id).subscribe((data) => {
                console.log("++++ CHAT +++ GOT RESPONSE:", data)
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
                console.log("THREAD ID FROM DATA", data.thread_id)
                console.log("THREAD ID", this.selectedThread.thread_id)
                this.disableInput = false
            });
        }
    }


    changeTab() {
        this.showThreadsList = !this.showThreadsList
        this.selectedThread = undefined
        this.getUserThreads()
    }

    newThread() {
        this.threadMessages = []
        this.inputField = ""
        this.selectedGraphId = ""
        this.selectedGraph = undefined
        this.graphService.getNewThreadID().subscribe((data) => {
            this.thread_id = data
            console.log("got threads", data)
        });
        this.selectedThread = new Thread()
        this.selectedThread.thread_id = this.thread_id;
        console.log("NEW THREAD WITH ID", this.thread_id)
    }

    deleteThread() {
        this.openWarningDialog()
    }

    openWarningDialog(): void {
        const dialogRef = this.dialog.open(WarningDialogComponentComponent, {
            width: '400px',
            data: { threadID: this.selectedThread?.thread_id }
        });
        dialogRef.componentInstance.deleteThreadEmitter.subscribe((shouldDelete: boolean) => {
            console.log("PARENT GOT EMISSION", shouldDelete)
            if (shouldDelete) {
                console.log("Thread deletion confirmed.", this.thread_id);
                if (this.selectedThread) {
                    this.graphService.deleteChat(this.selectedThread.thread_id).subscribe()
                } else {
                    this.graphService.deleteChat(this.thread_id).subscribe()
                }
                this.changeTab()
            }

        });
    }
}
