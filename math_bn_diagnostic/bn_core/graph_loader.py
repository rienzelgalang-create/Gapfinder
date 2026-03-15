# graph_loader.py
# This module contains the function to load a graph from a GraphML file and relabel its nodes.

import networkx as nx

def load_graph_with_labels(path):
    graph = nx.read_graphml(path)

    mapping = {}
    for node, data in graph.nodes(data=True):

        label = None

        if "label" in data:
            label = data["label"]

        elif "graphics" in data and isinstance(data["graphics"], dict):
            label = data["graphics"].get("text")

        if label is None:
            label = node

        mapping[node] = label

    graph = nx.relabel_nodes(graph, mapping)

    return graph