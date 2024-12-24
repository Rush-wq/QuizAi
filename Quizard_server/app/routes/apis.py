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
    try:
        file_list = request.files.getlist('files') if 'files' in request.files else ([request.files['file']] if 'file' in request.files else None)
        prompt = request.form.get('prompt')


        if not prompt:
            return APIResponse.error("GENERATION_ERROR", "There was an error generating your quiz")

        generation_response = quiz_generator.generate_quiz(quiz_description=prompt, files=file_list)

        if "error" in generation_response:
            error = generation_response["error"]
            return APIResponse.error(
                code=error["code"],
                message=error["message"],
                details=error.get("details")
            )

        return APIResponse.success(data=generation_response["data"])

    except Exception as e:
        print(f"Error in generate_quiz: {str(e)}")
        return APIResponse.error("GENERATION_ERROR", "There was an error processing your request")