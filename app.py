from flask import Flask
from flask import render_template, request
import pandas as pd

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'Không có tệp nào được gửi.'

    file = request.files['file']
    if file.filename == '':
        return 'Không có tệp nào được chọn.'
    df = pd.read_csv(file)
    content = df.to_string()
    return content
    
@app.route("/")
def root():
    return render_template("index.html")

@app.route("/get_dashboard")
def get_dashboard():
    return render_template("dashboard.html")

@app.route("/get_prediction")
def get_prediction():
    return render_template("predict.html")


if __name__ == '__main__':
    app.run(debug=True)
