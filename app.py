import csv

from wtforms.fields.choices import SelectField
import weightfunctions as wf
from flask import Flask, render_template, request, redirect, url_for
from flask_wtf import FlaskForm
from wtforms import DateField, DecimalField
from waitress import serve

app = Flask(__name__)
app.config['SECRET_KEY'] = 'CasaDelPiss'

##
#Classes
##

class WeightForm(FlaskForm):
    date = DateField('Date')
    weight = DecimalField('Weigh')
    user = SelectField('Pissboi no.', choices=[('Hanus','1 Hanus'), ('Magnus', '2 Magnus')])

##
#Endpoints
##

@app.route('/weight/register', methods=['POST'])
def weight_register():
        date = request.form['Date']
        weight = request.form['Weight']
        user = request.form['User']
        wf.weightinsert(date, weight, user)
        return redirect(url_for('index'))

@app.route('/weight', methods=['GET'])
def weight_form():
    return render_template('weightformula.html')

@app.route('/', methods =['GET'])
def index():
    return render_template('index.html')

@app.route('/test', methods=['GET'])
def test():
    form = WeightForm()
    return render_template('test.html', form = WeightForm())


##
#Functions
##

def initialize_file():
    with open("weight.csv", "w", encoding="utf-8", newline="") as file:
        csv_writer = csv.writer(file, delimiter=",")
        csv_writer.writerow(["date","weight","user"])

if __name__ == "__main__":
    initialize_file()
    serve(app, host="localhost", port="6969")