import uuid
import weightfunctions as wf
import liftfunctions as lf
import wordlefunctions as wdf
import csv
from datetime import date
from wtforms.fields.choices import SelectField
from wtforms.fields.simple import SubmitField
from wtforms.validators import InputRequired, NumberRange
from wtforms import DateField, DecimalField, IntegerField
from flask import Flask, render_template, request, Response, redirect, url_for, jsonify, make_response
from flask_wtf import FlaskForm
from waitress import serve

app = Flask(__name__)
app.config['SECRET_KEY'] = 'CasaDelPiss'

##
# Classes
##


class WeightForm(FlaskForm):

    date = DateField(
        'Date',
        [InputRequired()],
        format="%Y-%m-%d",
        default=date.today)

    weight = DecimalField(
        'Weigh',
        [InputRequired(),
         NumberRange(min=1, max=100)])

    user = SelectField(
        'Pissboi no.',
        [InputRequired()],
        choices=[
            ('', ''),
            ('Hanus', '1 Hanus'),
            ('Magnus', '2 Magnus')])

    submit = SubmitField('Submit')


class LiftForm(FlaskForm):

    date = DateField(
        'Date',
        [InputRequired()],
        format="%Y-%m-%d",
        default=date.today
    )

    exercise = SelectField(
        'Exercise',
        [InputRequired()],
        choices=[
            ('', ''),
            ('Squat', 'Squat'),
            ('Benchpress', 'Bench press'),
            ('Deadlift', 'Deadlift')
        ]
    )

    weight = IntegerField(
        'Weight',
        [InputRequired(),
         NumberRange(min=0, max=150)]
    )

    user = SelectField(
        'Pissboi no.',
        [InputRequired()],
        choices=[
            ('', ''),
            ('Hanus', '1 Hanus'),
            ('Magnus', '2 Magnus')
        ]
    )

    submit = SubmitField('Submit')
##
# Endpoints
##


@app.route('/', methods=['GET'])
def index():
    res = make_response(render_template('index.html'))
    return res


@app.route('/cookie',  methods=['GET'])
def cookie_management():
    cookies = request.cookies
    qid = cookies.get("qid")
    if qid == None:
        res = make_response('cookie set')
        res.set_cookie('qid', str(uuid.uuid4()))
        return res
    else:
        res = make_response('cookie already set')
        return res


@app.route('/weight', methods=['GET'])
def weight_form():
    weight_form = WeightForm()
    lift_form = LiftForm()
    return render_template('weightformula.html', weight=weight_form, lift=lift_form)


@app.route('/weight/register', methods=['POST'])
def weight_register():
    weight_form = WeightForm()
    if weight_form.validate_on_submit:
        date = request.form['date']
        weight = request.form['weight']
        user = request.form['user']
        wf.weightinsert(date, weight, user)
        return redirect(url_for('weight_form'))


@app.route('/weight/get', methods=['GET'])
def weight_get():
    data = wf.weightget()
    return jsonify(data)


@app.route('/lift/register', methods=['POST'])
def lift_register():
    lift_form = LiftForm()
    if lift_form.validate_on_submit:
        date = request.form['date']
        exercise = request.form['exercise']
        weight = request.form['weight']
        user = request.form['user']
        lf.liftinsert(date, exercise, weight, user)
        return redirect(url_for('weight_form'))


@app.route('/lift/get', methods=['GET'])
def lift_get():
    data = lf.liftget()
    return jsonify(data)


@app.route('/test', methods=['GET'])
def test():
    return render_template('test.html')


@app.route('/wordle/setanswer', methods=['GET'])
def save_wordle_answer():
    qid = request.cookies.get("qid")
    wdf.saveCookieWordle(qid)
    res = make_response('Answer set')
    return res


@app.route('/wordle/getanswer', methods=['GET'])
def deliver_answer():
    qid = request.cookies.get("qid")
    answer = wdf.readCookieWordle(qid)
    return answer


@app.route('/wordle/submitguess', methods=['POST'])
def submit_guess():
    submittedGuess = request.json
    qid = request.cookies.get("qid")
    correctAnswer = wdf.readCookieWordle(qid)
    if wdf.validateWord(submittedGuess):
        colored_guess = wdf.colorCodeLettersInGuess(
            correctAnswer, submittedGuess)
        return jsonify(colored_guess)
    else:
        return jsonify(False)


##
# Functions
##


def initialize_files():
    with open("weight.csv", "w", encoding="utf-8", newline="") as file:
        csv_writer = csv.writer(file, delimiter=",")
        csv_writer.writerow(["date", "weight", "user"])

    with open("lift.csv", "w", encoding="utf-8", newline="") as file:
        csv_writer = csv.writer(file, delimiter=",")
        csv_writer.writerow(["date", "exercise", "weight", "user"])


if __name__ == "__main__":
    #    initialize_files()
    serve(app, host="localhost", port="6969")
