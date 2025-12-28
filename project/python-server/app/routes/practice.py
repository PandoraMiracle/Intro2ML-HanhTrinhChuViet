# coding: utf-8
"""
Practice Routes - API endpoints cho tính năng Practice
"""
from flask import Blueprint, jsonify, request
from ..services.practice_service import (
    generate_practice_questions,
    check_answer,
    check_ca_dao_answer,
    check_daily_life_answers_batch_with_llm
)

practice_bp = Blueprint("practice", __name__, url_prefix="/practice")


@practice_bp.get("/")
def home():
    """
    Trang chủ Practice API
    """
    return jsonify({
        "message": "Practice API - Vietnamese Learning App",
        "endpoints": {
            "GET /practice/questions": "Lấy 10 câu hỏi (5 ca dao + 5 đời thường)",
            "POST /practice/check-answer": "Kiểm tra câu trả lời"
        }
    })


@practice_bp.get("/questions")
def get_questions():
    """
    GET /practice/questions
    
    Trả về 10 câu hỏi điền khuyết:
    - 5 câu ca dao/tục ngữ (có answer)
    - 5 câu đời thường (không có answer)
    
    Response:
    {
        "questions": [
            {
                "id": 1,
                "type": "ca_dao",
                "question": "Gần mực thì đen, gần đèn thì ____",
                "answer": "sáng",
                "original": "Gần mực thì đen, gần đèn thì sáng"
            },
            {
                "id": 6,
                "type": "doi_thuong",
                "question": "Hôm nay trời ____"
            }
        ]
    }
    """
    try:
        questions = generate_practice_questions()
        
        # Với câu ca_dao, giữ answer để frontend có thể kiểm tra local
        # Với câu doi_thuong, không gửi answer
        response_questions = []
        for q in questions:
            if q["type"] == "ca_dao":
                response_questions.append({
                    "id": q["id"],
                    "type": q["type"],
                    "question": q["question"],
                    "answer": q["answer"],
                    "original": q.get("original", "")
                })
            else:
                response_questions.append({
                    "id": q["id"],
                    "type": q["type"],
                    "question": q["question"]
                })
        
        return jsonify({
            "success": True,
            "questions": response_questions
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@practice_bp.post("/check-answer")
def check_answer_route():
    """
    POST /practice/check-answer
    
    Kiểm tra câu trả lời của người dùng.
    
    Request body:
    {
        "id": 6,
        "type": "doi_thuong",  // hoặc "ca_dao"
        "question": "Hôm nay trời ____",
        "user_answer": "nắng",
        "correct_answer": "..." // (chỉ cần cho ca_dao)
    }
    
    Response:
    {
        "success": true,
        "is_correct": true,
        "explanation": "Câu trả lời hợp lý.",
        "correct_answer": "..." // (chỉ cho ca_dao)
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "error": "Missing request body"
            }), 400
        
        # Validate required fields
        required_fields = ["id", "type", "question", "user_answer"]
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "error": f"Missing required field: {field}"
                }), 400
        
        question_id = data["id"]
        question_type = data["type"]
        question = data["question"]
        user_answer = data["user_answer"]
        correct_answer = data.get("correct_answer")  # Chỉ cho ca_dao
        
        # Validate question type
        if question_type not in ["ca_dao", "doi_thuong"]:
            return jsonify({
                "success": False,
                "error": f"Invalid question type: {question_type}"
            }), 400
        
        # Kiểm tra câu trả lời
        result = check_answer(
            question_type=question_type,
            question=question,
            user_answer=user_answer,
            correct_answer=correct_answer
        )
        
        return jsonify({
            "success": True,
            "question_id": question_id,
            **result
        })
        
    except Exception as e:
        print(f"❌ Error in check_answer_route: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@practice_bp.post("/check-batch")
def check_batch_route():
    """
    POST /practice/check-batch
    
    Kiểm tra nhiều câu trả lời cùng lúc (dùng khi submit toàn bộ bài).
    
    Request body:
    {
        "answers": [
            {
                "id": 1,
                "type": "ca_dao",
                "question": "...",
                "user_answer": "...",
                "correct_answer": "..."
            },
            ...
        ]
    }
    
    Response:
    {
        "success": true,
        "results": [
            {
                "question_id": 1,
                "is_correct": true,
                "explanation": "..."
            },
            ...
        ],
        "score": 8,
        "total": 10
    }
    """
    try:
        data = request.get_json()
        
        if not data or "answers" not in data:
            return jsonify({
                "success": False,
                "error": "Missing 'answers' in request body"
            }), 400
        
        answers = data["answers"]
        
        # Tách câu hỏi thành 2 nhóm: ca_dao và doi_thuong
        ca_dao_answers = []
        doi_thuong_answers = []
        
        for answer_data in answers:
            if answer_data.get("type") == "ca_dao":
                ca_dao_answers.append(answer_data)
            elif answer_data.get("type") == "doi_thuong":
                doi_thuong_answers.append(answer_data)
        
        # Kiểm tra ca_dao (không cần LLM)
        ca_dao_results = {}
        for answer_data in ca_dao_answers:
            question_id = answer_data.get("id")
            user_answer = answer_data.get("user_answer", "")
            correct_answer = answer_data.get("correct_answer", "")
            
            is_correct, explanation = check_ca_dao_answer(correct_answer, user_answer)
            ca_dao_results[question_id] = {
                "is_correct": is_correct,
                "explanation": explanation,
                "correct_answer": correct_answer
            }
        
        # Kiểm tra doi_thuong (gộp 1 lần gọi LLM)
        doi_thuong_results = {}
        if doi_thuong_answers:
            batch_data = [
                {
                    "id": item.get("id"),
                    "question": item.get("question"),
                    "user_answer": item.get("user_answer", "")
                }
                for item in doi_thuong_answers
            ]
            
            llm_results = check_daily_life_answers_batch_with_llm(batch_data)
            
            for result in llm_results:
                doi_thuong_results[result["id"]] = {
                    "is_correct": result["is_correct"],
                    "explanation": result["explanation"]
                }
        
        # Gộp kết quả theo đúng thứ tự
        results = []
        score = 0
        
        for answer_data in answers:
            question_id = answer_data.get("id")
            question_type = answer_data.get("type")
            
            if question_type == "ca_dao" and question_id in ca_dao_results:
                result = ca_dao_results[question_id]
            elif question_type == "doi_thuong" and question_id in doi_thuong_results:
                result = doi_thuong_results[question_id]
            else:
                result = {
                    "is_correct": False,
                    "explanation": "Không thể kiểm tra câu trả lời này."
                }
            
            if result.get("is_correct"):
                score += 1
            
            results.append({
                "question_id": question_id,
                **result
            })
        
        return jsonify({
            "success": True,
            "results": results,
            "score": score,
            "total": len(answers)
        })
        
    except Exception as e:
        print(f"❌ Error in check_batch_route: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
