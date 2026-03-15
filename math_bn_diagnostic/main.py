# main.py
# This is the main script to run the diagnostic engine on multiple Bayesian Networks for different mathematical domains

from models.whole_numbers_operations import create_model as whole_numbers_model
from models.fractions_operations import create_model as fractions_model
from models.geometric_figures import create_model as geometry_model
from models.measure_units import create_model as measures_model

from bn_core.inference_engine import DiagnosticEngine


# Load all models
models = {
    "Whole Numbers": whole_numbers_model(),
    "Fractions": fractions_model(),
    "Geometry": geometry_model(),
    "Measures": measures_model()
}


# Example student evidence (all assessments together)
student_evidence = {

    # Whole Numbers Assessments
    #"3.2.13 Assessment": 1,
    #"3.3.08 Assessment": 1,
    "3.4.06 Assessment": 1,

    # Fractions Assessments
    #"4.2.14 Assessment": 1,
    "4.3.03 Assessment": 1,

    # Geometry Assessments
    "2.4.12 Assessment": 1,
    "3.1.01 Assessment": 0,

    # Measures Assessments
    "2.4.09 Assessment": 1,
}


print("\n===== STUDENT DIAGNOSTIC REPORT =====\n")


for domain, (model, skills) in models.items():

    engine = DiagnosticEngine(model, skills)

    # Filter evidence relevant to this BN
    valid_nodes = set(model.nodes())
    filtered_evidence = {
        k: v for k, v in student_evidence.items()
        if k in valid_nodes
    }

    if not filtered_evidence:
        continue

    print(f"\n--- {domain} ---")

    results = engine.diagnose(filtered_evidence)

    engine.print_results(results)