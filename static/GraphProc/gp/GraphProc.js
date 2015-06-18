/**
 * Created by sam.royston on 3/24/15.
 */

function randomChoice(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}
var edgeInventory;
var edgeIndices= {};
var getNeighborFormat = function(graph){
    /**
     * returns dictionary of node neighbors, assumes undirected graph
     */
    nodeDict = {};

    for( var j = 0; j < graph.edges.length; j ++){
        var edge = graph.edges[j];
        if(nodeDict[edge.source] && nodeDict[edge.target]){
            nodeDict[edge.source].free.push(edge.target);
            nodeDict[edge.target].free.push(edge.source);
        }
        else if(nodeDict[edge.source]){
            nodeDict[edge.source].free.push(edge.target);
            nodeDict[edge.target] = { ind:null, path:null, id:edge.target, free:[edge.source], touched:[], saturated:[] };
        }
        else if(nodeDict[edge.target]){
            nodeDict[edge.source] = { ind:null, path:null, id:edge.source, free:[edge.target], touched:[], saturated:[] };
            nodeDict[edge.target].free.push(edge.source);
        }
        else{
            nodeDict[edge.target] = {ind:null, path:null, id:edge.target, free:[edge.source], touched:[], saturated:[] };
            nodeDict[edge.source] = {ind:null, path:null,  id:edge.source, free:[edge.target], touched:[], saturated:[] };
        }
    }
    return nodeDict;
};

var getEdgeDictionary = function(graph){
    /*
     * efficient structure for querying edges. Assumes undirected.
     */
    edgeDict = {};
    for ( var j = 0; j < graph.edges.length; j ++ ) {
        var edge = graph.edges[j];
        var s = [edge.source, edge.target].sort();
        //if(edge.source != edge.target){
            edgeDict[s.join(":")] = true;
        //}
    }
    return edgeDict;
};

var getNodeDictionary = function(graph){
    /*
     * efficient structure for querying edges. Heavy memory usage.
     */
    nodeDict = {};
    for ( var j = 0; j < graph.edges.length; j ++ ) {
        var node = graph.nodes[j];
        nodeDict[node.id] = true;
    }
    return nodeDict;
};


var pathFind = function(graph, neighbors){
    /**
     * finds non-redundant paths
     */
    edgeInventory = getEdgeDictionary(graph);
    var currentNode = graph.nodes[Math.floor(Math.random() * graph.nodes.length)];

    var currentNeighbors = neighbors[currentNode.id];

    var walking = true;
    var paths = [];
    var drawCount = 0;
    var count = 0;
    while (drawCount < graph.edges.length && Object.keys(edgeInventory).length > 0 && count < 5000){
        var strokeCount = 0;
        var edge_id = Object.keys(edgeInventory)[0];
        var node_id = edge_id.split(':')[0];
        currentNeighbors = neighbors[node_id];
        var path = [node_id];
        count++;
        
        while(walking){
            
            var result = walk(currentNeighbors);
            if (result){
                neighbors[result].path = paths.length;
                neighbors[result].ind = path.length;
                var format_id = [result, currentNeighbors.id].sort().join(':');

                if(edgeIndices[format_id]){
                    edgeIndices[format_id].push({path:paths.length, index:path.length})
                }
                else{
                    edgeIndices[format_id] = [{path:paths.length, index:path.length}]
                }
                path.push(result);

                currentNeighbors = neighbors[result];
                strokeCount++;
                if( edgeInventory[format_id] ){
                    delete edgeInventory[format_id];
                    drawCount ++;
                }
            }
            else{
                paths.push(path);
                break;
            }
        }
    }
    return paths;
};

var walk = function(node){

    if (node && node.free.length > 0 ){
        return node.touched[node.touched.push(node.free.pop()) - 1]
    }
    else if (node && node.touched.length > 0){
        return node.saturated[node.saturated.push(node.touched.pop()) - 1];
    }
    else{
        return false;
    }
};
