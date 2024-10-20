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
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    constructor(private location: Location, private graphService: GraphService, private renderer: Renderer2) {
    }

    ngOnInit() {
        console.log("ON INIT GETTING GRAPHS")

        this.graphService.getGraphsByUserId(this.myUser.user_id).subscribe((data) => {
            this.gotUserGraphs = data
            console.log("got graphs", data)
        });
        console.log("ON INIT GETTING THREADS")
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
        // try {
        //     this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        // } catch (err) {
        //     console.error('Scroll error', err);
        // }
    }

    ngAfterViewInit(): void {
        // this.renderer.listen(this.resizer.nativeElement, 'mousedown', (event: MouseEvent) => {
        //     this.initResize(event);
        // });
    }

    resize(event: MouseEvent) {
        // if (!this.upperBox) return;
        // const newHeight = event.clientY - this.upperBox.nativeElement.getBoundingClientRect().top;
        // this.renderer.setStyle(this.upperBox.nativeElement, 'height', `${newHeight}px`);
    }

    initResize(event: MouseEvent) {
        event.preventDefault();
        const mouseMoveListener = this.renderer.listen('window', 'mousemove', (mouseMoveEvent: MouseEvent) => this.resize(mouseMoveEvent));
        const mouseUpListener = this.renderer.listen('window', 'mouseup', () => {
            mouseMoveListener();
            mouseUpListener();
        });
    }


    goBack() {
        this.location.back();
    }

    onGraphSelected($event: kg) {
        this.graphToUse = $event
        this.usedGraphId = this.graphToUse.graph_id
        this.showGraphToUse = true;
    }

    onGraphClosed($event: boolean) {
        this.graphToUse = undefined
        this.showGraphToUse = false;
    }

    pushMessage(message: Message) {
        this.threadMessages.push(message)
        this.reloadThread()
    }

    reloadThread() {

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
            this.messages.push(new Message("USER", this.inputField))
            console.log("SENDING MESSAGE VALUES",
                "GRAPH ID", this.usedGraphId,
                "USER MESSAGE", this.userMessage,
            )
            this.userMessage.content = this.inputField
            this.inputField = ""
            console.log("sending message", this.selectedThread?.thread_id, this.selectedThread?.usedGraphId)
            this.pushMessage(new Message("USER", this.userMessage.content))
            // todo decommentare per chattare effettivamente
            // this.graphService.executeChatSystem(this.userMessage.content, this.usedGraphId, "1234").subscribe((data) => {
            //     console.log("++++ AAAAA +++ GOT RESPONSE:", data)
            //     this.llmRes.content = data.llm_res;
            //     this.gotContext = data.context;
            //     this.visitedNodes = data.nodes;
            //     this.visitedEdges = data.edges
            //     this.pushMessage(new Message("BOT", this.llmRes.content))
            //     this.showContext(this.gotContext)
            //     this.updateGraphView(this.visitedNodes, this.visitedEdges)
            // });
        }
    }

    changeTab() {
        this.showThreadsList = !this.showThreadsList
    }

    newThread() {

    }

    deleteThread() {

    }
}
