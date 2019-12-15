import csv 
from collections import defaultdict

msg_to_num_re = defaultdict(int)
msg_to_date_and_user = {}

with open('YInt.csv', newline='') as initYintCSV:
    # with open('YintNoRe.csv', 'w', newline='') as YIntNoRe: # a appends, w writes
        # fieldnames = ["time","location","account","message"]
        # writer = csv.DictWriter(YIntNoRe, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
    reader = csv.DictReader(initYintCSV)

        # writer.writeheader()
                        
    for row in reader:
        msg = row["message"]
        if msg[:4] == "re: ":
            stripped = msg[4:]
            msg_to_num_re[stripped] += 1
            if stripped not in msg_to_date_and_user:
                msg_to_date_and_user[stripped] = {"time": row["time"], "user": row["account"]}
        else:
            # writer.writerow(row)
            msg_to_date_and_user[msg] = {"time": row["time"], "user": row["account"]}

pairs = sorted([(num, msg) for msg, num in msg_to_num_re.items()], reverse=True)

with open("YIntRetweetsWithTime.csv", 'w', newline='') as retweets:
    writer = csv.DictWriter(retweets, fieldnames = ["message", "re_count", "user", "time"],  quoting=csv.QUOTE_ALL)
    writer.writeheader()
    for num, msg in pairs:
        writer.writerow({"message": msg, "re_count": num, "time": msg_to_date_and_user[msg]["time"], "user": msg_to_date_and_user[msg]["user"]})