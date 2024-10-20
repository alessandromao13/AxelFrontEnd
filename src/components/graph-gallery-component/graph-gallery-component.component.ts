import {Component, OnInit} from '@angular/core';
import {Location, NgClass, NgForOf, NgIf} from "@angular/common";
import {GraphService} from "../../services/graph.service";
import {FormsModule} from "@angular/forms";
import {kg} from "../../modules/Graph";
import {D3GraphComponent} from "../d3-graph/d3-graph.component";
import {NavBarComponent} from "../nav-bar/nav-bar.component";
import {LoadingComponent} from "../loading/loading.component";


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
        LoadingComponent
    ],
    templateUrl: './graph-gallery-component.component.html',
    styleUrl: './graph-gallery-component.component.css'
})
export class GraphGalleryComponentComponent implements OnInit {

    gotUserGraphs: kg[] = []
    visualizeGraph = false
    selectedGraphId = ""
    loading = false
    selectedGraph: kg | undefined = undefined
    mostUsedNode: string = ""

    constructor(private location: Location, private graphService: GraphService) {
    }

    ngOnInit() {
        // Call the service to get graphs by user ID
        this.loading = true
        this.graphService.getGraphsByUserId("1").subscribe((data) => {
            this.gotUserGraphs = data
            console.log("OOOOO DATA", this.gotUserGraphs)
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
        console.log("GOT GRAPH TO OPEN", graphId)
        this.visualizeGraph = true
        this.selectedGraphId = graphId
        this.getGraphById(graphId)

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
        console.log("TRYYYYYY")
        if (selectedGraph !== undefined) {
            const result = this.getMaxUsageRelation(selectedGraph)
            console.log(result)
            return result
        } else {
            return undefined
        }
    }

    getMaxUsageRelation(graph: kg): any | null {
        // Filter out relations with null usage_weight
        const validRelations = graph.relations.filter(relation => relation.usage_weight !== null);

        // Return null if there are no valid relations
        if (validRelations.length === 0) {
            return null;
        }

        // Find the relation with the maximum usage_weight
        return validRelations.reduce((max, relation) => {
            return (relation.usage_weight! > max.usage_weight!) ? relation : max;
        });
    }
}
