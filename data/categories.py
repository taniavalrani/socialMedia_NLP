import yaml
import csv 
from collections import defaultdict

categories = None


with open("goodWordList.yaml", 'r') as wordlist:
    try:
        categories = yaml.safe_load(wordlist)
    except yaml.YAMLError as exc:
        print(exc)

print(categories)


with open('YIntNoRe.csv', newline='') as initYintCSV:
    with open('YIntFiltered.csv', 'w', newline='') as YIntFiltered: # a appends, w writes
        fieldnames = ["time","location","account","message","categories"]
        writer = csv.DictWriter(YIntFiltered, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        reader = csv.DictReader(initYintCSV)

        writer.writeheader()
                        
        for row in reader:
            row["message"] = row["message"].lower()
            cur_cats = []
            for category, words in categories.items():
                for word in words:
                    if word in row["message"]:
                        cur_cats.append(category)
                        break
            if cur_cats != []:
                row["categories"] = ','.join(cur_cats)
                writer.writerow(row)    
            

