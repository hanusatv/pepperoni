import csv
from datetime import date
from flask import app
from numpy import array
import numpy
from numpy.lib.function_base import append

def weightinsert(date, weight, user):
    with open("weight.csv", "a" , newline="", encoding="utf-8") as file:
        csv_writer = csv.writer(file, delimiter=",")
        csv_writer.writerow([date,weight,user])

def weightget():
    with open("weight.csv", newline="", encoding="utf-8") as file:
        csv_reader = csv.DictReader (file)
        csv_data = []
        return_data = {}
        for row in csv_reader:
            csv_data.append(row)

        unique_users_list = []
        for row in csv_data:
            if row['user'] not in unique_users_list:
                unique_users_list.append(row['user'])
                return_data[row['user']] = []
        
        print(unique_users_list)

        xy_coordinate = []
        for user in unique_users_list:
            for row in csv_data:
                if row['user'] == user:
                    xy_coordinate.append(row['date'])
                    xy_coordinate.append(row['weight'])
                    return_data[user].append(xy_coordinate)
                    xy_coordinate = []
                    
        return(return_data)
            
            
def weightprint():
    print(weightget())


                
