from google import genai
import google.generativeai as googleGenai
from dotenv import load_dotenv
from typing import Dict, Any
import os
import json


load_dotenv()


class QuizGenerator(object):
    prompt_format_enforcer_text = '''
    IT IS IMPERATIVE THAT THE RESPONSE IS A JSON AND NO OTHER TEXT.
    MAKE SURE TO FOLLOW THIS RULE AT ALL COSTS.
    ITS IMPORTANT TO VALUE ACCURACY IN BOTH THE QUESTIONS AND ANSWERS AND ALWAYS PREFER THE REFERENCE DATA IF GIVEN BEFORE RESEARCHING ONLINE.

    Here is the json schema:
    {{
    "$schema": "http://json-schema.org/draft-07/schema",
    "type": "object",
    "required": ["questions"],
    "properties": {{
        "questions": {{
        "type": "array",
        "items": {{
            "type": "object",
            "required": ["title", "options", "answer"],
            "properties": {{
            "title": {{
                "type": "string",
                "description": "The question text"
            }},
            "options": {{
                "type": "array",
                "minItems": 4,
                "maxItems": 4,
                "items": {{
                "type": "string",
                "description": "An answer option"
                }}
            }},
            "answer": {{
                "type": "integer",
                "minimum": 0,
                "maximum": 3,
                "description": "Index of the correct answer (0-3)"
            }}
            }},
            "additionalProperties": false
        }},
        "minItems": 1
        }}
    }},
    "additionalProperties": false
    }}
    '''

    def __init__(self):
        self.client = genai.Client(api_key = os.getenv('GOOGLE_API_KEY'))
        self.model_id = "gemini-2.0-flash-exp"

        googleGenai.configure(api_key=os.environ["GOOGLE_API_KEY"])
        self.model = googleGenai.GenerativeModel("gemini-2.0-flash-exp") 

    def generate_quiz(self, quiz_description: str, file=None) -> Dict[str, Any]:
        """
        Generate a quiz based on description using AI model.
        Returns dictionary with quiz data or error information.
        """

        if not quiz_description.strip():
            return {
                "error": {
                    "code": "INVALID_INPUT",
                    "message": "Quiz description cannot be empty"
                }
            }

        prompt = (
            f"Generate a quiz based on: {quiz_description}. "
            f"Send this quiz back in a json file format. "
            f"{self.prompt_format_enforcer_text}"
        )

        file_to_gen = None

        if file:
            temp_dir = os.path.join(os.path.dirname(__file__), 'temp')
            os.makedirs(temp_dir, exist_ok=True)

            temp_path = os.path.join(temp_dir, f"temp_{os.urandom(8).hex()}{os.path.splitext(file.filename)[1]}")
            with open(temp_path, 'wb') as temp:
                temp.write(file.read())

            
            file_to_gen = googleGenai.upload_file(path=temp_path)

        try:
            response = self.model.generate_content(
                contents=prompt if not file_to_gen else [file_to_gen, prompt],
            )

            if not response:
                return {
                    "error": {
                        "code": "GENERATION_FAILED",
                        "message": "No response from AI model"
                    }
                }

            response_text = str(response.text)
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            

            if json_start == -1 or json_end == 0:
                return {
                    "error": {
                        "code": "INVALID_RESPONSE",
                        "message": "No valid JSON found in response"
                    }
                }

            quiz_data = json.loads(response_text[json_start:json_end])
            return {"data": quiz_data}

        except json.JSONDecodeError as e:
            return {
                "error": {
                    "code": "INVALID_JSON",
                    "message": "Invalid JSON format in response",
                    "details": {"error": str(e)}
                }
            }

        except Exception as e:
            return {
                "error": {
                    "code": "GENERATION_FAILED",
                    "message": "Failed to generate quiz",
                    "details": {"error": str(e)}
                }
            }