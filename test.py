import requests

API_URL = "http://192.168.11.129:3000/query/selEquGrid"

def get_equ_filter():
    payload = {
        "type_id": 2,
        "equ_id": 50
    }

    response = requests.post(API_URL, json=payload)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Query service failed")


# Example usage:
data = get_equ_filter()
print(data)
