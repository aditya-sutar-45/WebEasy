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

def explain_like_five(text):
    """
    Send the text to the LLM to get an explanation suitable for a 5-year-old
    """
    prompt = f"""
    Explain the following text in simple terms that a 5-year-old would understand:
    
    {text}
    
    Use short sentences, simple words, and fun comparisons.
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

@app.route('/explain', methods=['POST'])
def explain():
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({"error": "Please provide text to explain"}), 400
    
    selected_text = data['text']
    explanation = explain_like_five(selected_text)
    
    return jsonify({
        "original_text": selected_text,
        "explanation": explanation
    })

# For testing in console
def test_explanation():
    test_text = """
    Quantum computing is a type of computing that uses quantum-mechanical phenomena, 
    such as superposition and entanglement, to perform operations on data. 
    Unlike classical computing, which uses bits that are either 0 or 1, 
    quantum computing uses quantum bits or qubits that can exist in multiple states simultaneously.
    """
    
    explanation = explain_like_five(test_text)
    
    print("Original Text:")
    print(test_text)
    print("\nExplanation for a 5-year-old:")
    print(explanation)

if __name__ == '__main__':
    # Test the explanation function
    test_explanation()
    
    # Run the Flask app
    app.run(debug=True, port=5000)