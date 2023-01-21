from typing import Optional
from flask import Flask, render_template, request
from utils import safe_wrap
from model import generate_response

app = Flask(__name__)


@app.get('/')
def index():
    return render_template('index.html')


@app.post('/api/v1/ask')
@safe_wrap(lambda: {"success": False, "content": "An Error has occured"})
def index():

    json: dict[str, Optional[str]] = request.get_json()
    prompt = json.get("prompt")

    if prompt is None:
       return {"success": False, "content": "No Prompt provided"}

    if not prompt.endswith("?"):
        prompt += "?"

    answer = generate_response(prompt)
    return {"success": True, "content": answer}


if __name__ == "__main__":
    app.run(port=8080)    