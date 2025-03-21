import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {kg} from "../modules/Graph";
import {ChatResponse} from "../modules/ChatResponse";
import {Thread} from "../modules/Thread";
import {UserDocument} from "../modules/Document";
import {PdfResponse} from "../modules/PdfResponse";

@Injectable({
    providedIn: 'root' // This makes the service available throughout the app
})
export class GraphService {
    private baseUrl = 'http://localhost:8000';

    constructor(private http: HttpClient) {
    }

    getGraphById(graphId: string): Observable<{ nodes: any[], links: any[] }> {
        return this.http.get<{ _graph: any }>(`${this.baseUrl}/get-graph-by-id/${graphId}`).pipe(
            map(response => this.parseGraphData(response._graph))
        );
    }


    executeChatSystem(userQuery: string, graphId: string, ragId: string, userId: string, threadId: string | undefined): Observable<ChatResponse> {
        const body = {
            rag_id: ragId,
            user_query: userQuery,
            graph_id: graphId,
            thread_id: threadId
        };
        return this.http.post<ChatResponse>(`${this.baseUrl}/chat/${userId}`, body);
    }


    getGraphsByUserId(userId: string) {
        return this.http
            .get(`${this.baseUrl}/get-graph-by-user-id/${userId}`)
            .pipe(map(value => value as kg[]));
    }

    getUserPDF(user_id: any, documentId: any) {
        return this.http
            .get(`${this.baseUrl}/get-user-document/${user_id}/${documentId}`, {responseType: 'blob'})
            .pipe(map((blob: Blob) => {
                const pdfFile = new File([blob], 'document.pdf', {type: blob.type});
                return {got_pdf: pdfFile} as PdfResponse;
            }));
    }

    getThreadsByUserId(userId: string) {
        return this.http
            .get(`${this.baseUrl}/get-threads-by-user-id/${userId}`)
            .pipe(map(value => value as Thread[]));
    }

    generateGraph(userId: string, inputText: string, topic: string, summary: string): Observable<{
        userGraphs: any[]
    }> {
        const body = {
            input_text: inputText,
            topic: topic,
            summary: summary
        };
        const user_id_cast = Number(userId);
        return this.http.post<{ userGraphs: any[] }>(`${this.baseUrl}/generate-graph/${user_id_cast}`, body);
    }


    generateGraphWithPDF(userId: string, topic: string, summary: string, uploadedFile: File): Observable<{
        userGraphs: any[]
    }> {
        const formData = new FormData();
        formData.append('uploaded_file', uploadedFile); // Match the backend key 'uploaded_file'
        formData.append('topic', topic); // Match the backend key 'topic'
        formData.append('summary', summary); // Match the backend key 'summary'

        const user_id_cast = Number(userId);
        return this.http.post<{ userGraphs: any[] }>(`${this.baseUrl}/generate-rag-pdf/${user_id_cast}`, formData, {
            reportProgress: true,
            observe: 'response'
        }).pipe(
            map(response => response.body as { userGraphs: any[] })
        );
    }

    getUserDocumentsByUseId(user_id: string) {
        // console.log("GETTING USER DOCS BY ID", user_id)
        return this.http
            .get(`${this.baseUrl}/user-rags/${user_id}`)
            .pipe(map(value => value as UserDocument[]));
    }

    getNewThreadID() {
        return this.http
            .get(`${this.baseUrl}/new-thread`)
            .pipe(map(value => value as string));
    }

    deleteChat(thread_id: string) {
        return this.http
            .get(`${this.baseUrl}/delete-thread/${thread_id}`)
            .pipe(map(value => value as string));
    }

    deleteDocument(user_id: string, document_id: string) {
        // console.log("DELETING DOCUMENT: ", document_id)
        return this.http
            .get(`${this.baseUrl}/delete-user-document/${user_id}/${document_id}`)
            .pipe(map(value => value as string));
    }


    private parseGraphData(graphData: any): { nodes: any[], links: any[] } {
        const nodes: any[] = [];
        const links: any[] = [];

        for (const nodeName in graphData._node) {
            nodes.push({name: nodeName});
        }

        for (const source in graphData._adj) {
            for (const target in graphData._adj[source]) {
                links.push({
                    source: source,
                    target: target,
                });
            }
        }

        return {nodes, links};
    }
}
