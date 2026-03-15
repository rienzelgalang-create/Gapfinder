# whole_numbers_operations.py
# This module defines the create_model function to build the Bayesian Network for whole numbers operations.

from pathlib import Path
from bn_core.graph_loader import load_graph_with_labels
from bn_core.bn_builder import build_bn_from_graph

BASE_DIR = Path(__file__).resolve().parent.parent

GRAPH_PATH = str(BASE_DIR / "graphml" / "WholeNumbersOperationsBN.graphml")

def create_model():

    graph = load_graph_with_labels(GRAPH_PATH)

    model = build_bn_from_graph(graph)

    skills = [
        n for n in graph.nodes()
        if graph.out_degree(n) > 0
    ]

    return model, skills