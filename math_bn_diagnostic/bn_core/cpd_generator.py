# cpd_generator.py
# This module contains functions to generate CPDs for skills and assessments in a Bayesian Network.

from pgmpy.factors.discrete import TabularCPD


def root_skill_cpd(skill):
    return TabularCPD(
        variable=skill,
        variable_card=2,
        values=[[0.5], [0.5]]
    )


def skill_child_cpd(skill, parents):

    parent_count = len(parents)
    combinations = 2 ** parent_count

    values_false = []
    values_true = []

    for i in range(combinations):

        mastered_parents = bin(i).count("1")
        strength = mastered_parents / parent_count if parent_count else 0

        prob_mastered = 0.2 + 0.7 * strength
        prob_not = 1 - prob_mastered

        values_false.append(prob_not)
        values_true.append(prob_mastered)

    return TabularCPD(
        variable=skill,
        variable_card=2,
        values=[values_false, values_true],
        evidence=parents,
        evidence_card=[2] * parent_count
    )


def assessment_cpd(question, parents):

    parent_count = len(parents)
    combinations = 2 ** parent_count

    values_incorrect = []
    values_correct = []

    for i in range(combinations):

        mastered_parents = bin(i).count("1")

        strength = mastered_parents / parent_count

        prob_correct = 0.1 + 0.8 * strength
        prob_incorrect = 1 - prob_correct

        values_incorrect.append(prob_incorrect)
        values_correct.append(prob_correct)

    return TabularCPD(
        variable=question,
        variable_card=2,
        values=[values_incorrect, values_correct],
        evidence=parents,
        evidence_card=[2] * parent_count
    )