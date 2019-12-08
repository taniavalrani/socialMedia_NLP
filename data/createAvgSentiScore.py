import csv
import collections
import re


with open('senti.csv', newline='') as senti:
    with open('avg_senti.csv', 'w', newline='') as avgs:
        fieldnames = ["time","score", "max", "min", "number_of_tweets"]
        reader = csv.DictReader(senti)
        writer = csv.DictWriter(avgs, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        counter = 0
        curr_time = ""
        curr_scores = []
        writer.writeheader()
        for row in reader:
            print(counter)
            counter += 1
            if curr_time == "":
                curr_time = row["time"]
                start = row["senti"].find("compound': ")
                start += 11
                end = row["senti"].find("}")
                curr_scores.append(float(row["senti"][start:end]))
                # print(curr_scores)
            elif curr_time == row["time"]:
                start = row["senti"].find("compound': ")
                start += 11
                end = row["senti"].find("}")
                curr_scores.append(float(row["senti"][start:end]))
                # print(curr_scores)
            else:
                average = sum(curr_scores) / len(curr_scores)
                to_write = collections.OrderedDict()
                to_write["time"] = curr_time
                to_write["score"] = average
                to_write["max"] = max(curr_scores)
                to_write["min"] = min(curr_scores)
                to_write["number_of_tweets"] = len(curr_scores)
                curr_time = row["time"]
                curr_scores = []
                start = row["senti"].find("compound': ")
                start += 11
                end = row["senti"].find("}")
                curr_scores.append(float(row["senti"][start:end]))
                
                # print(curr_scores)
                writer.writerow(to_write)