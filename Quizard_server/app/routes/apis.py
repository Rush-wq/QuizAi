from flask import Blueprint, jsonify, request
from datetime import datetime, timezone
from app.utils.quiz_generator import QuizGenerator
from app.utils.api_response import APIResponse

api_blueprint = Blueprint('main', __name__)
quiz_generator = QuizGenerator()

@api_blueprint.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'success',
        'message': 'Service is running',
        'timestamp': datetime.now(timezone.utc).isoformat()
    })

@api_blueprint.route('/quiz/generate_quiz', methods=['POST'])
def generate_quiz():
    data = request.get_json()

    if "prompt" not in data:
        return APIResponse.error("GENERATION_ERROR", "There was an error generating your quiz")
    
    print("Testing")

    generation_response = quiz_generator.generate_quiz(quiz_description=data["prompt"])

    if "error" in generation_response:
        error = generation_response["error"]
        return APIResponse.error(
            code=error["code"],
            message=error["message"],
            details=error.get("details")
        )

    return APIResponse.success(data=generation_response["data"])