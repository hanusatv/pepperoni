import csv

def weightinsert(date, weight, user):
    with open("weight.csv", "a" , newline="", encoding="utf-8") as file:
        csv_writer = csv.writer(file, delimiter=",")
        csv_writer.writerow([date,weight,user])