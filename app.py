import csv
import weightfunctions as wf
from flask import Flask, render_template, request, redirect, url_for
from waitress import serve

app = Flask(__name__)

@app.route('/weight/register', methods=['POST'])
def weight_register():
        date = request.form['Date']
        weight = request.form['Weight']
        user = request.form['User']
        wf.weightinsert(date, weight, user)
        return redirect(url_for('weight_form'))

@app.route('/weight', methods=['GET'])
def weight_form():
    return render_template('weightformula.html')

@app.route('/', methods =['GET'])
def index():
    return render_template('index.html')

def initialize_file():
    with open("weight.csv", "w", encoding="utf-8", newline="") as file:
        csv_writer = csv.writer(file, delimiter=",")
        csv_writer.writerow(["date","weight","user"])

if __name__ == "__main__":
    initialize_file()
    serve(app, host="localhost", port="6969")