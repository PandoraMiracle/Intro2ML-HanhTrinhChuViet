# coding: utf-8
"""
LLM Routes - Xử lý các request từ Node.js backend cho VinaLLaMA model
"""
from flask import Blueprint, jsonify, request
from ..services.vinallama_service import generate_response, get_model_info, init_vinallama

llm_bp = Blueprint("llm", __name__, url_prefix="/llm")


@llm_bp.get("/")
def home():
    return jsonify({
        "message": "VinaLLaMA-7B-Chat API",
        "endpoints": {
            "POST /llm/generate": "Sinh response từ prompt",
            "GET /llm/info": "Lấy thông tin model",
            "POST /llm/init": "Khởi tạo model (pre-load)"
        }
    })


@llm_bp.post("/init")
def initialize_model():
    """
    Endpoint để pre-load model.
    Gọi endpoint này khi server khởi động để load model trước.
    """
    try:
        init_vinallama()
        info = get_model_info()
        return jsonify({
            "message": "Model initialized successfully",
            "model_info": info
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@llm_bp.get("/info")
def model_info():
    """
    Lấy thông tin về model đang sử dụng.
    """
    try:
        info = get_model_info()
        return jsonify(info)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@llm_bp.post("/generate")
def generate():
    """
    Sinh response từ prompt.
    
    Request body (JSON):
    {
        "prompt": "Câu cần xử lý",
        "max_new_tokens": 256,      // optional, default 256
        "do_sample": true,          // optional, default true
        "temperature": 0.7,         // optional, default 0.7
        "top_p": 0.9                // optional, default 0.9
    }
    
    Response:
    {
        "message": "OK",
        "prompt": "...",
        "response": "...",
        "model_id": "vilm/vinallama-7b-chat"
    }
    """
    try:
        data = request.get_json()
        
        if not data or "prompt" not in data:
            return jsonify({"error": "Missing 'prompt' in request body"}), 400
        
        prompt = data["prompt"]
        max_new_tokens = data.get("max_new_tokens", 256)
        do_sample = data.get("do_sample", True)
        temperature = data.get("temperature", 0.7)
        top_p = data.get("top_p", 0.9)
        
        # Validate parameters
        if not isinstance(prompt, str) or len(prompt.strip()) == 0:
            return jsonify({"error": "Invalid prompt"}), 400
        
        if not isinstance(max_new_tokens, int) or max_new_tokens < 1:
            max_new_tokens = 256
        
        if max_new_tokens > 2048:
            max_new_tokens = 2048  # Giới hạn max tokens
        
        # Generate response
        response = generate_response(
            prompt=prompt,
            max_new_tokens=max_new_tokens,
            do_sample=do_sample,
            temperature=temperature,
            top_p=top_p
        )
        
        return jsonify({
            "message": "OK",
            "prompt": prompt,
            "response": response,
            "model_id": "vilm/vinallama-7b-chat"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@llm_bp.post("/chat")
def chat():
    """
    Endpoint dành cho chat format (tương tự OpenAI API).
    
    Request body (JSON):
    {
        "messages": [
            {"role": "user", "content": "Xin chào!"}
        ],
        "max_new_tokens": 256,
        "temperature": 0.7
    }
    """
    try:
        data = request.get_json()
        
        if not data or "messages" not in data:
            return jsonify({"error": "Missing 'messages' in request body"}), 400
        
        messages = data["messages"]
        
        if not isinstance(messages, list) or len(messages) == 0:
            return jsonify({"error": "Invalid messages format"}), 400
        
        # Chuyển messages thành prompt format cho VinaLLaMA
        # Format: ### User: ... ### Assistant: ...
        prompt_parts = []
        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            
            if role == "user":
                prompt_parts.append(f"### User: {content}")
            elif role == "assistant":
                prompt_parts.append(f"### Assistant: {content}")
            elif role == "system":
                prompt_parts.append(f"### System: {content}")
        
        # Thêm prefix cho assistant response
        prompt_parts.append("### Assistant:")
        prompt = "\n".join(prompt_parts)
        
        max_new_tokens = data.get("max_new_tokens", 256)
        temperature = data.get("temperature", 0.7)
        
        response = generate_response(
            prompt=prompt,
            max_new_tokens=max_new_tokens,
            do_sample=True,
            temperature=temperature,
            top_p=0.9
        )
        
        return jsonify({
            "message": "OK",
            "response": response,
            "model_id": "vilm/vinallama-7b-chat"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
