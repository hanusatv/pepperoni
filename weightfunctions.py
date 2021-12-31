import csv
from numpy import array
from numpy.lib.function_base import append

def weightinsert(date, weight, user):
    with open("weight.csv", "a" , newline="", encoding="utf-8") as file:
        csv_writer = csv.writer(file, delimiter=",")
        csv_writer.writerow([date,weight,user])

def weightget():
    return_data = dict()
    with open("weight.csv", newline="", encoding="utf-8") as file:
        csv_reader = csv.DictReader (file)
        for row in csv_reader:
            user = row["user"]
            date = row["date"]
            weight = row["weight"]
            return_data.setdefault(user,[]).append((date,weight))
            return_data[user].sort()
    
    return return_data

                
