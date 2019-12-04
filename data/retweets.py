import csv 
from collections import defaultdict

msg_to_num_re = defaultdict(int)

with open('YInt.csv', newline='') as initYintCSV:
    with open('YintNoRe.csv', 'w', newline='') as YIntNoRe: # a appends, w writes
        fieldnames = ["time","location","account","message"]
        writer = csv.DictWriter(YIntNoRe, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        reader = csv.DictReader(initYintCSV)

        writer.writeheader()
                        
        for row in reader:
            msg = row["message"]
            if msg[:4] == "re: ":
                msg_to_num_re[msg[4:]] += 1
            else:
                writer.writerow(row)

pairs = sorted([(num, msg) for msg, num in msg_to_num_re.items()], reverse=True)

with open("YIntRetweets.csv", 'w', newline='') as retweets:
    writer = csv.DictWriter(retweets, fieldnames = ["message", "re_count"],  quoting=csv.QUOTE_ALL)
    writer.writeheader()
    for num, msg in pairs:
        writer.writerow({"message": msg, "re_count": num})