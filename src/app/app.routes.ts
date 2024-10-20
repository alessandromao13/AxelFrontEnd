import { Routes } from '@angular/router';
import {NewGraphComponent} from "../components/new-graph/new-graph.component";
import {WelcomePageComponent} from "../components/welcome-page/welcome-page.component";
import {GraphGalleryComponentComponent} from "../components/graph-gallery-component/graph-gallery-component.component";
import {ChatComponentComponent} from "../components/chat-component/chat-component.component";
import {CreateGraphComponent} from "../components/create-graph/create-graph.component";
import {DragAndDropComponent} from "../components/drag-and-drop/drag-and-drop.component";
import {GraphCreationPageComponent} from "../components/graph-creation-page/graph-creation-page.component";


export const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'new-graph', component: NewGraphComponent },
  { path: 'graph-gallery', component: GraphGalleryComponentComponent },
  { path: 'chat', component: ChatComponentComponent },
  { path: 'create-new-graph', component: GraphCreationPageComponent },
  // todo remove this after implementation of new graph form
  { path: 'create-new-graph-old', component: NewGraphComponent },
  // { path: 'drag-and-drop-test', component: DragAndDropComponent },

];

