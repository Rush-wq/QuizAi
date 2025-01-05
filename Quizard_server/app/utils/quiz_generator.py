import google.generativeai as googleGenai
from dotenv import load_dotenv
from typing import Dict, Any, Optional
import os
import json


load_dotenv()


class QuizGenerator(object):

    def __init__(self):
        default_path = os.path.dirname(os.path.abspath(__file__))

        with open(os.path.join(default_path, 'prompt_tools', 'prompt_start.txt'), "r") as file:
            self.prompt_start_text = file.read()

        with open(os.path.join(default_path, 'prompt_tools', 'prompt_end.txt'), "r") as file:
            self.prompt_end_text = file.read()

        with open(os.path.join(default_path, 'prompt_tools', 'prompt_json_schema.txt'), "r") as file:
            self.prompt_josn_schema_text = file.read()

        googleGenai.configure(api_key=os.environ["GOOGLE_API_KEY"])
        self.model = googleGenai.GenerativeModel("gemini-2.0-flash-exp") 


    def generate_quiz(self, quiz_description: str, files:Optional[list] = None) -> Dict[str, Any]:
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

        prompt =f"""
            {self.prompt_start_text}
            Generate a quiz based on: {quiz_description}. 
            {self.prompt_end_text}
            {self.prompt_josn_schema_text}
            """



        files_to_gen = []

        if files:
            for file in files:
                temp_dir = os.path.join(os.path.dirname(__file__), 'temp')
                os.makedirs(temp_dir, exist_ok=True)

                temp_path = os.path.join(temp_dir, f"temp_{os.urandom(8).hex()}{os.path.splitext(file.filename)[1]}")
                with open(temp_path, 'wb') as temp:
                    temp.write(file.read())

                
                files_to_gen.append(googleGenai.upload_file(path=temp_path))

        try:
            content_for_model = [prompt]
            content_for_model.extend(files_to_gen)

            response = self.model.generate_content(
                contents=content_for_model,
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