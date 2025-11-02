from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': '*'}})

@app.route('/test', methods=['POST', 'OPTIONS'])
def test():
    return 'ok', 200

if __name__ == '__main__':
    app.run(port=5000, debug=False) 