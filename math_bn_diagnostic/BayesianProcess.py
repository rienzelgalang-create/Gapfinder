import sys
import json
from models.whole_numbers_operations import create_model as whole_numbers_model
from bn_core.inference_engine import DiagnosticEngine

def main():
    try:
        # 1. RECEIVE: Node.js now sends an object like {"A/S Fluency": 2, "Division Fluency": 0}
        raw_input = sys.argv[1]
        frontend_scores = json.loads(raw_input) 
    except (IndexError, json.JSONDecodeError):
        print(json.dumps({"error": "Invalid or missing input"}))
        return

    # 2. THE DEMO MAPPING: Tie the exact frontend titles to your BN nodes
    demo_mapping = {
        "A/S Fluency": "2.1.13 Assessment",
        "Multiplication Facts": "2.3.05 Assessment",
        "Multi-Digit Multiplication": "3.3.08 Assessment",
        "Division Fluency": "2.3.09 Assessment",
        "Order of Operations": "4.2.07 Assessment",
        "Word-Problem Translation": "3.4.06 Assessment" 
    }

    # 3. TRANSLATE & SIMPLIFY
    student_evidence = {}
    
    for exam_title, score in frontend_scores.items():
        # Only process it if it's one of our mapped demo topics
        if exam_title in demo_mapping:
            node_name = demo_mapping[exam_title]
            # Binary Logic: Score >= 1 is 1 (True/Pass), else 0 (False/Fail)
            student_evidence[node_name] = 1 if score >= 1 else 0

    # Load models
    models = {
        "Whole Numbers": whole_numbers_model(),
    }
    
    final_diagnostics = {}

    for domain, (model, skills) in models.items():
        engine = DiagnosticEngine(model, skills)
        
        # 4. FILTER: Check which assessments actually exist in your model
        valid_nodes = set(model.nodes())
        filtered_evidence = {
            k: v for k, v in student_evidence.items() 
            if k in valid_nodes
        }

        if not filtered_evidence:
            continue

        # 5. DIAGNOSE
        results = engine.diagnose(filtered_evidence)
        
        # Format to percentages (e.g., 85.4)
        final_diagnostics[domain] = {
            skill: round(prob * 100, 1) for skill, prob in results.items()
        }

    # 6. SHARE
    print(json.dumps(final_diagnostics))

if __name__ == "__main__":
    main()