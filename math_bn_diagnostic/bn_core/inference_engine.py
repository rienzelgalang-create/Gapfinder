# inference_engine.py
# This module contains the DiagnosticEngine class, which performs inference on a Bayesian Network to diagnose student skills based on evidence from assessments.

from pgmpy.inference import VariableElimination


class DiagnosticEngine:

    def __init__(self, model, skills):

        self.model = model
        self.skills = skills
        self.inference = VariableElimination(model)

    def diagnose(self, evidence):

        results = {}

        for skill in self.skills:

            q = self.inference.query(
                variables=[skill],
                evidence=evidence,
                show_progress=False
            )

            results[skill] = q.values[1]

        return results

    def print_results(self, results):

        print(f"\n{'LATENT SKILL':<30} | {'MASTERY'}")
        print("-" * 45)

        for skill, prob in results.items():

            bar = "█" * int(prob * 20)

            print(f"{skill:<30} | {prob:>6.2%} {bar}")