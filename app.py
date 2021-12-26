import csv
from datetime import date
from typing import DefaultDict
from wtforms.fields.choices import SelectField
from wtforms.fields.simple import SubmitField
import weightfunctions as wf
from flask import Flask, render_template, request, redirect, url_for
from flask_wtf import FlaskForm
from wtforms import DateField, DecimalField
from wtforms.validators import InputRequired, NumberRange
from waitress import serve

app = Flask(__name__)
app.config['SECRET_KEY'] = 'CasaDelPiss'

##
#Classes
##

class WeightForm(FlaskForm):
    date = DateField(
        'Date',
        [InputRequired()],
        format="%Y-%m-%d",
        default = date.today)

    weight = DecimalField(
        'Weigh', 
        [InputRequired(), 
        NumberRange(min=1, max=100)])
    
    user = SelectField(
        'Pissboi no.', 
        [InputRequired()],
         choices=[
             ('',''),
             ('Hanus','1 Hanus'), 
             ('Magnus', '2 Magnus')])
    
    submit = SubmitField('Submit')

##
#Endpoints
##

@app.route('/weight/register', methods=['POST'])
def weight_register():
    form = WeightForm()
    if form.validate_on_submit:
        date = request.form['date']
        weight = request.form['weight']
        user = request.form['user']
        wf.weightinsert(date, weight, user)
        return redirect(url_for('weight_form'))

@app.route('/weight', methods=['GET'])
def weight_form():
    form = WeightForm()
    return render_template('weightformula.html', form = form)

@app.route('/', methods =['GET'])
def index():
    return render_template('index.html')

@app.route('/test', methods=['GET'])
def test():
    return render_template('test.html', form = WeightForm())

##
#Functions
##

def initialize_file():
    with open("weight.csv", "w", encoding="utf-8", newline="") as file:
        csv_writer = csv.writer(file, delimiter=",")
        csv_writer.writerow(["date","weight","user"])

if __name__ == "__main__":
#    initialize_file()
    serve(app, host="localhost", port="6969")

""" if __name__ == "__main__":
    initialize_file()
    app.run(debug=True) """