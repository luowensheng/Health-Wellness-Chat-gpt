import openai
from utils import safe_wrap
import os

MODEL_NAME = os.getenv("MODEL_NAME") 

assert not MODEL_NAME is None, f"Could not load model, please set 'MODEL_NAME' as an environment variables containing the name of the model you want to use"

@safe_wrap()
def generate_response(prompt: str):
    
    response = openai.Completion.create(
                model=MODEL_NAME,
                prompt= f"{prompt} ->",
                temperature=0.89,
                max_tokens=500,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0.6,
                stop=["\n"]
    )
    print(response)
    return response.get("choices")[0]["text"]
