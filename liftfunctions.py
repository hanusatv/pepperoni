import csv
import os

DATA_DIR = "data"


def liftinsert(date, exercise, weight, user):
    with open(os.path.join(DATA_DIR, "lift.csv"), "a", newline="", encoding="utf-8") as file:
        csv_writer = csv.writer(file, delimiter=",")
        csv_writer.writerow([date, exercise, weight, user])


def liftget():
    return_data = []
    with open(os.path.join(DATA_DIR, "lift.csv"), newline="", encoding="utf-8") as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            return_data.append(row)
    return return_data
