import requests

API_URL = "http://192.168.11.129:3000/query/selEquFilterGrid"

def get_equ_filter():
    payload = {
        "type_id": 10510,
        "equ_id": 6
    }

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    response = requests.post(API_URL, json=payload, headers=headers)

    if response.ok:
        return response.json()
    else:
        raise Exception(f"Query service failed: {response.status_code} - {response.text}")

# Example usage:
data = get_equ_filter()
print(data)
