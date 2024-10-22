import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {kg} from "../modules/Graph";
import {ChatResponse} from "../modules/ChatResponse";
import {Thread} from "../modules/Thread";

@Injectable({
  providedIn: 'root' // This makes the service available throughout the app
})
export class GraphService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getGraphById(graphId: string): Observable<{ nodes: any[], links: any[] }> {
    return this.http.get<{ _graph: any }>(`${this.baseUrl}/get-graph-by-id/${graphId}`).pipe(
      map(response => this.parseGraphData(response._graph))
    );
  }


  executeChatSystem(userQuery: string, graphId: string, userId: string, threadId: string | undefined): Observable<ChatResponse> {
    const body = {
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

  getThreadsByUserId(userId: string) {
    return this.http
        .get(`${this.baseUrl}/get-threads-by-user-id/${userId}`)
        .pipe(map(value => value as Thread[]));
  }

  generateGraph(userId: string, inputText: string, topic: string, summary: string): Observable<{ userGraphs: any[] }> {
    const body = {
      input_text: inputText,
      topic: topic,
      summary: summary
    };
    // fixme: fix this everywhere
    const user_id_cast =  Number(userId);
    return this.http.post<{ userGraphs: any[] }>(`${this.baseUrl}/generate-graph/${user_id_cast}`, body);
  }


  generateGraphWithPDF(userId: string, topic: string, summary: string, uploadedFile: File): Observable<{ userGraphs: any[] }> {
    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('topic', topic);
    formData.append('summary', summary);
    const user_id_cast = Number(userId);
    return this.http.post<{ userGraphs: any[] }>(`${this.baseUrl}/generate-graph-pdf/${user_id_cast}`, formData, {
      reportProgress: true,
      observe: 'response'
    }).pipe(
        map(response => response.body as { userGraphs: any[] })
    );
  }


  getNewThreadID(){
    return this.http
        .get(`${this.baseUrl}/new-thread`)
        .pipe(map(value => value as string));
  }

  deleteChat(thread_id: string){
    return this.http
        .get(`${this.baseUrl}/delete-thread/${thread_id}`)
        .pipe(map(value => value as string));
  }


  private parseGraphData(graphData: any): { nodes: any[], links: any[] } {
    const nodes: any[] = [];
    const links: any[] = [];

    for (const nodeName in graphData._node) {
      nodes.push({ name: nodeName });
    }

    for (const source in graphData._adj) {
      for (const target in graphData._adj[source]) {
        links.push({
          source: source,
          target: target,
        });
      }
    }

    return { nodes, links };
  }
}
