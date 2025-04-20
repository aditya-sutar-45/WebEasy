
''' older one do not delete '''
# from dotenv import load_dotenv
# import os
# from groq import Groq
# from flask import Flask, request, jsonify

# # Load environment variables
# load_dotenv()

# # Initialize Groq client
# client = Groq(
#     api_key=os.environ.get("GROQ_API_KEY"),
# )

# # Initialize Flask app
# app = Flask(__name__)

# def explain_like_five(text):
#     """
#     Send the text to the LLM to get an explanation suitable for a 5-year-old
#     """
#     prompt = f"""
#     Explain the following text in simple terms that a 5-year-old would understand:
    
#     {text}
        
#     Use short sentences, simple words, and fun comparisons.
#     """
    
#     chat_completion = client.chat.completions.create(
#         messages=[
#             {
#                 "role": "user",
#                 "content": prompt,
#             }
#         ],
#         model="llama-3.3-70b-versatile",
#     )
    
#     return chat_completion.choices[0].message.content

# @app.route('/explain', methods=['POST'])
# def explain():
#     data = request.get_json()
    
#     if not data or 'text' not in data:
#         return jsonify({"error": "Please provide text to explain"}), 400
    
#     selected_text = data['text']
#     explanation = explain_like_five(selected_text)
    
#     return jsonify({
#         "original_text": selected_text,
#         "explanation": explanation
#     })

# # For testing in console
# def test_explanation():
#     test_text = """
#     Quantum computing is a type of computing that uses quantum-mechanical phenomena, 
#     such as superposition and entanglement, to perform operations on data. 
#     Unlike classical computing, which uses bits that are either 0 or 1, 
#     quantum computing uses quantum bits or qubits that can exist in multiple states simultaneously.
#     """
    
#     explanation = explain_like_five(test_text)
    
#     print("Original Text:")
#     print(test_text)
#     print("\nExplanation for a 5-year-old:")
#     print(explanation)

# if __name__ == '__main__':
#     # Test the explanation function
#     test_explanation()
    
#     # Run the Flask app
#     app.run(debug=True, port=5000)



''' modified thing'''

from dotenv import load_dotenv
import os
from groq import Groq
from flask import Flask, request, jsonify

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

# Initialize Flask app
app = Flask(__name__)

# Store the current simplicity level (default to 3 - elementary school level)
current_simplicity_level = 3

def get_simplicity_config(level):
    """
    Get the configuration for a specific simplicity level
    
    Parameters:
    level (int): Simplicity level from 1-5
    
    Returns:
    dict: Configuration for the specified simplicity level
    """
    simplicity_configs = {
        1: {
            "description": "using adult vocabulary with appropriate technical terms",
            "instructions": "Maintain technical accuracy and use domain-specific terminology where appropriate. Complex sentences and concepts are acceptable.",
            "name": "Adult/Technical"
        },
        2: {
            "description": "using vocabulary and concepts understandable to high school students",
            "instructions": "Use moderate vocabulary and explain technical terms. Keep sentences straightforward but can include some complexity.",
            "name": "High School"
        },
        3: {
            "description": "using vocabulary and concepts understandable to elementary school students",
            "instructions": "Use simple vocabulary and avoid technical jargon. Break down complex ideas into simpler components with concrete examples.",
            "name": "Elementary School"
        },
        4: {
            "description": "using vocabulary and concepts understandable to a 5-year-old",
            "instructions": "Use very simple words, short sentences, and familiar analogies. Focus on concrete concepts rather than abstract ideas.",
            "name": "Preschool (5-year-old)"
        },
        5: {
            "description": "using extremely simple vocabulary with very short sentences like talking to a toddler",
            "instructions": "Use only the most basic vocabulary, very short sentences, and lots of repetition. Use fun comparisons to everyday objects and experiences.",
            "name": "Toddler"
        }
    }
    
    # Default to level 3 if an invalid level is provided
    return simplicity_configs.get(level, simplicity_configs[3])

def simplify_text(text, simplicity_level):
    """
    Send the text to the LLM to get an explanation at the specified simplicity level
    
    Parameters:
    text (str): The text to simplify
    simplicity_level (int): Level from 1-5, where 5 is the simplest
    
    Returns:
    str: Simplified explanation
    """
    # Get configuration for the specified simplicity level
    config = get_simplicity_config(simplicity_level)
    
    prompt = f"""
    Explain the following text {config['description']}:
    
    {text}
    
    {config['instructions']}
    Make your explanation engaging and appropriate for the target understanding level.
    """
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    
    return chat_completion.choices[0].message.content

@app.route('/select-level', methods=['POST'])
def select_level():
    """Endpoint to select a simplicity level for the application"""
    global current_simplicity_level
    
    data = request.get_json()
    
    if not data or 'level' not in data:
        return jsonify({"error": "Please provide a simplicity level"}), 400
    
    try:
        level = int(data['level'])
    except ValueError:
        return jsonify({"error": "Simplicity level must be an integer"}), 400
    
    if level < 1 or level > 5:
        return jsonify({"error": "Simplicity level must be between 1 and 5"}), 400
    
    # Update the current simplicity level
    current_simplicity_level = level
    
    # Get config for the selected level
    config = get_simplicity_config(level)
    
    return jsonify({
        "success": True,
        "message": f"Simplicity level set to {level} ({config['name']})",
        "level": level,
        "level_name": config["name"]
    })

@app.route('/get-level', methods=['GET'])
def get_current_level():
    """Endpoint to get the currently selected simplicity level"""
    config = get_simplicity_config(current_simplicity_level)
    
    return jsonify({
        "level": current_simplicity_level,
        "level_name": config["name"]
    })

@app.route('/explain', methods=['POST'])
def explain():
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({"error": "Please provide text to explain"}), 400
    
    selected_text = data['text']
    
    # Use level from request if provided, otherwise use current global level
    simplicity_level = int(data.get('simplicity_level', current_simplicity_level))
    
    # Ensure simplicity level is within valid range
    if simplicity_level < 1 or simplicity_level > 5:
        return jsonify({"error": "Simplicity level must be between 1 and 5"}), 400
    
    # Get config for response
    config = get_simplicity_config(simplicity_level)
    explanation = simplify_text(selected_text, simplicity_level)
    
    return jsonify({
        "original_text": selected_text,
        "simplicity_level": simplicity_level,
        "level_name": config["name"],
        "explanation": explanation
    })

@app.route('/levels', methods=['GET'])
def get_levels():
    """Endpoint to get information about all available simplicity levels"""
    levels = {}
    for level in range(1, 6):
        config = get_simplicity_config(level)
        levels[level] = {
            "name": config["name"],
            "description": config["description"]
        }
    
    return jsonify({"simplicity_levels": levels})

# For testing in console
def test_explanation():
    test_text = """
    Quantum computing is a type of computing that uses quantum-mechanical phenomena, 
    such as superposition and entanglement, to perform operations on data. 
    Unlike classical computing, which uses bits that are either 0 or 1, 
    quantum computing uses quantum bits or qubits that can exist in multiple states simultaneously.
    """
    
    print("Original Text:")
    print(test_text)
    
    # Test multiple simplicity levels
    for level in range(1, 6):
        config = get_simplicity_config(level)
        explanation = simplify_text(test_text, level)
        print(f"\nExplanation at simplicity level {level} ({config['name']}):")
        print(explanation)
        print("-" * 50)

if __name__ == '__main__':
    # Test the explanation function
    test_explanation()
    
    # Run the Flask app
    app.run(debug=True, port=5000)