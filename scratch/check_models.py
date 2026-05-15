from google import genai
import os

api_key = "AIzaSyD7YOJ1dxv5xyUJfc6jaWoEes9LxvEYoDc"
client = genai.Client(api_key=api_key)

try:
    print("Testing gemini-1.5-flash...")
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents="Hi"
    )
    print("Success with gemini-1.5-flash")
except Exception as e:
    print(f"Failed gemini-1.5-flash: {e}")

try:
    print("\nListing all models...")
    for model in client.models.list():
        print(f"Model: {model.name}")
except Exception as e:
    print(f"Failed to list models: {e}")
