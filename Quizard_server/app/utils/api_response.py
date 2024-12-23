from datetime import datetime
from flask import jsonify, Response
from typing import Dict, Any, Tuple


class APIResponse:
    @staticmethod
    def error(
        code: str,
        message: str,
        status_code: int = 400,
        details: Dict[str, Any] = None
    ) -> Tuple[Response, int]:
        return jsonify({
            "status": "error",
            "error": {
                "code": code,
                "message": message,
                "details": details,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        }), status_code

    @staticmethod
    def success(
        data: Any,
        status_code: int = 200
    ) -> Tuple[Response, int]:
        return jsonify({
            "status": "success",
            "data": data,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }), status_code