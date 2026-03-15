#bn_core/bn_builder.py
# This module contains the function to build a Bayesian Network from a graph representation.

from pgmpy.models import DiscreteBayesianNetwork
from bn_core.cpd_generator import (
    root_skill_cpd,
    skill_child_cpd,
    assessment_cpd
)


def build_bn_from_graph(graph):

    edges = list(graph.edges())

    model = DiscreteBayesianNetwork(edges)

    cpds = []

    nodes = list(graph.nodes())

    for node in nodes:

        parents = list(graph.predecessors(node))

        is_assessment = "Assessment" in node

        if is_assessment:

            cpds.append(
                assessment_cpd(node, parents)
            )

        else:

            if len(parents) == 0:

                cpds.append(root_skill_cpd(node))

            else:

                cpds.append(
                    skill_child_cpd(node, parents)
                )

    model.add_cpds(*cpds)

    assert model.check_model()

    return model