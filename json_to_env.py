import json
import sys
import os

if len(sys.argv) < 2:
    print("Usage: python json_to_env.py <json_file>")
    sys.exit(1)

with open(sys.argv[1], "r") as f:
    data = json.load(f)

prefix = "FIREBASE_"

for key, value in data.items():
    env_key = prefix + key.upper().replace("-", "_")
    if isinstance(value, str):
        print(f'{env_key}="{value}"')
    elif isinstance(value, bool):
        print(f'{env_key}={str(value).lower()}')
    elif isinstance(value, (int, float)):
        print(f'{env_key}={value}')
    elif value is None:
        print(f'{env_key}=')
    else:
        print(f'{env_key}="{json.dumps(value)}"')