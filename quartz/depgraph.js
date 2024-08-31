export default class DepGraph {
    // node: incoming and outgoing edges
    _graph = new Map();
    constructor() {
        this._graph = new Map();
    }
    export() {
        return {
            nodes: this.nodes,
            edges: this.edges,
        };
    }
    toString() {
        return JSON.stringify(this.export(), null, 2);
    }
    // BASIC GRAPH OPERATIONS
    get nodes() {
        return Array.from(this._graph.keys());
    }
    get edges() {
        let edges = [];
        this.forEachEdge((edge) => edges.push(edge));
        return edges;
    }
    hasNode(node) {
        return this._graph.has(node);
    }
    addNode(node) {
        if (!this._graph.has(node)) {
            this._graph.set(node, { incoming: new Set(), outgoing: new Set() });
        }
    }
    // Remove node and all edges connected to it
    removeNode(node) {
        if (this._graph.has(node)) {
            // first remove all edges so other nodes don't have references to this node
            for (const target of this._graph.get(node).outgoing) {
                this.removeEdge(node, target);
            }
            for (const source of this._graph.get(node).incoming) {
                this.removeEdge(source, node);
            }
            this._graph.delete(node);
        }
    }
    forEachNode(callback) {
        for (const node of this._graph.keys()) {
            callback(node);
        }
    }
    hasEdge(from, to) {
        return Boolean(this._graph.get(from)?.outgoing.has(to));
    }
    addEdge(from, to) {
        this.addNode(from);
        this.addNode(to);
        this._graph.get(from).outgoing.add(to);
        this._graph.get(to).incoming.add(from);
    }
    removeEdge(from, to) {
        if (this._graph.has(from) && this._graph.has(to)) {
            this._graph.get(from).outgoing.delete(to);
            this._graph.get(to).incoming.delete(from);
        }
    }
    // returns -1 if node does not exist
    outDegree(node) {
        return this.hasNode(node) ? this._graph.get(node).outgoing.size : -1;
    }
    // returns -1 if node does not exist
    inDegree(node) {
        return this.hasNode(node) ? this._graph.get(node).incoming.size : -1;
    }
    forEachOutNeighbor(node, callback) {
        this._graph.get(node)?.outgoing.forEach(callback);
    }
    forEachInNeighbor(node, callback) {
        this._graph.get(node)?.incoming.forEach(callback);
    }
    forEachEdge(callback) {
        for (const [source, { outgoing }] of this._graph.entries()) {
            for (const target of outgoing) {
                callback([source, target]);
            }
        }
    }
    // DEPENDENCY ALGORITHMS
    // Add all nodes and edges from other graph to this graph
    mergeGraph(other) {
        other.forEachEdge(([source, target]) => {
            this.addNode(source);
            this.addNode(target);
            this.addEdge(source, target);
        });
    }
    // For the node provided:
    // If node does not exist, add it
    // If an incoming edge was added in other, it is added in this graph
    // If an incoming edge was deleted in other, it is deleted in this graph
    updateIncomingEdgesForNode(other, node) {
        this.addNode(node);
        // Add edge if it is present in other
        other.forEachInNeighbor(node, (neighbor) => {
            this.addEdge(neighbor, node);
        });
        // For node provided, remove incoming edge if it is absent in other
        this.forEachEdge(([source, target]) => {
            if (target === node && !other.hasEdge(source, target)) {
                this.removeEdge(source, target);
            }
        });
    }
    // Remove all nodes that do not have any incoming or outgoing edges
    // A node may be orphaned if the only node pointing to it was removed
    removeOrphanNodes() {
        let orphanNodes = new Set();
        this.forEachNode((node) => {
            if (this.inDegree(node) === 0 && this.outDegree(node) === 0) {
                orphanNodes.add(node);
            }
        });
        orphanNodes.forEach((node) => {
            this.removeNode(node);
        });
        return orphanNodes;
    }
    // Get all leaf nodes (i.e. destination paths) reachable from the node provided
    // Eg. if the graph is A -> B -> C
    //                     D ---^
    // and the node is B, this function returns [C]
    getLeafNodes(node) {
        let stack = [node];
        let visited = new Set();
        let leafNodes = new Set();
        // DFS
        while (stack.length > 0) {
            let node = stack.pop();
            // If the node is already visited, skip it
            if (visited.has(node)) {
                continue;
            }
            visited.add(node);
            // Check if the node is a leaf node (i.e. destination path)
            if (this.outDegree(node) === 0) {
                leafNodes.add(node);
            }
            // Add all unvisited neighbors to the stack
            this.forEachOutNeighbor(node, (neighbor) => {
                if (!visited.has(neighbor)) {
                    stack.push(neighbor);
                }
            });
        }
        return leafNodes;
    }
    // Get all ancestors of the leaf nodes reachable from the node provided
    // Eg. if the graph is A -> B -> C
    //                     D ---^
    // and the node is B, this function returns [A, B, D]
    getLeafNodeAncestors(node) {
        const leafNodes = this.getLeafNodes(node);
        let visited = new Set();
        let upstreamNodes = new Set();
        // Backwards DFS for each leaf node
        leafNodes.forEach((leafNode) => {
            let stack = [leafNode];
            while (stack.length > 0) {
                let node = stack.pop();
                if (visited.has(node)) {
                    continue;
                }
                visited.add(node);
                // Add node if it's not a leaf node (i.e. destination path)
                // Assumes destination file cannot depend on another destination file
                if (this.outDegree(node) !== 0) {
                    upstreamNodes.add(node);
                }
                // Add all unvisited parents to the stack
                this.forEachInNeighbor(node, (parentNode) => {
                    if (!visited.has(parentNode)) {
                        stack.push(parentNode);
                    }
                });
            }
        });
        return upstreamNodes;
    }
}
