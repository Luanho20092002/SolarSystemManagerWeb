from flask import Flask, jsonify
from flask import render_template, request
import pandas as pd, numpy as np
from keras.models import load_model
from datetime import datetime, timedelta

def standar(df):
    weather = {'Patchy rain possible': 0.27, 
           'Sunny': 0.99, 
           'Moderate rain at times': 0.22, 
           'Overcast': 0.5, 
           'Partly cloudy': 0.67, 
           'Cloudy': 0.56, 
           'Heavy rain at times': 0.16, 
           'Moderate or heavy rain shower': 0.11, 
           'Light rain shower': 0.33, 
           'Mist': 0.44, 
           'Patchy light rain with thunder': 0.24, 
           'Thundery outbreaks possible': 0.31, 
           'Patchy light drizzle': 0.39, 
           'Torrential rain shower': 0.01
    }   
    df["Weather"] = df['Weather'].map(weather)
    df["Watt"] = df['Watt'] / 1000
    return df

def create_test_data(df):
    if len(df) < 14:
        return None
    dataframe = df.values
    timestep, feature = dataframe.shape
    dataframe = dataframe.reshape(1, timestep, feature)
    return dataframe

app = Flask(__name__)
md = load_model("models/cnn_lstm.h5")

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'Không có tệp nào được gửi.'

    file = request.files['file']
    if file.filename == '':
        return 'Không có tệp nào được chọn.'
    
    df = pd.read_csv(file)
    df = standar(df)
    
    X = df.drop(columns=['Date'], axis=1)
    X_test = create_test_data(X)

    # Tạo ra mảng gồm 14d + 7d liên tiếp nhau
    dates = df["Date"].values.tolist()
    last_date = datetime.strptime(dates[-1], "%Y-%m-%d")
    for i in range(1, 8):
        new_date = last_date + timedelta(days=i)
        dates.append(new_date.strftime("%Y-%m-%d"))

    past = df["Watt"].values.tolist()
    future = md.predict(X_test, verbose=0).reshape(-1).tolist()
    return [dates, past, future] 
    
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
