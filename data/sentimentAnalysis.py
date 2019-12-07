from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import csv
# # --- examples -------
# sentences = ["VADER is smart, handsome, and funny.",  # positive sentence example
#              "VADER is smart, handsome, and funny!",  # punctuation emphasis handled correctly (sentiment intensity adjusted)
#              "VADER is very smart, handsome, and funny.", # booster words handled correctly (sentiment intensity adjusted)
#              "VADER is VERY SMART, handsome, and FUNNY.",  # emphasis for ALLCAPS handled
#              "VADER is VERY SMART, handsome, and FUNNY!!!", # combination of signals - VADER appropriately adjusts intensity
#              "VADER is VERY SMART, uber handsome, and FRIGGIN FUNNY!!!", # booster words & punctuation make this close to ceiling for score
#              "VADER is not smart, handsome, nor funny.",  # negation sentence example
#              "The book was good.",  # positive sentence
#              "At least it isn't a horrible book.",  # negated negative sentence with contraction
#              "The book was only kind of good.", # qualified positive sentence is handled correctly (intensity adjusted)
#              "The plot was good, but the characters are uncompelling and the dialog is not great.", # mixed negation sentence
#              "Today SUX!",  # negative slang with capitalization emphasis
#              "Today only kinda sux! But I'll get by, lol", # mixed sentiment example with slang and constrastive conjunction "but"
#              "Make sure you :) or :D today!",  # emoticons handled
#              "Catch utf-8 emoji such as such as 💘 and 💋 and 😁",  # emojis handled
#              "Not bad at all"  # Capitalized negation
#              ]

analyzer = SentimentIntensityAnalyzer()

with open('YInt.csv', newline='') as data:
    with open('senti.csv', 'w', newline='') as senti:
        fieldnames = ["time","location","account","message","senti"]
        reader = csv.DictReader(data)
        writer = csv.DictWriter(senti, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        counter = 0
        writer.writeheader()

        for row in reader:
            print(counter)
            counter += 1
            to_write = row
            msg = row["message"]
            vs = analyzer.polarity_scores(msg)
            to_write.update({"senti" : vs})
            writer.writerow(to_write)





# with open('YInt.csv', newline='') as data:
#     with open('senti.csv', 'w', newline='') as senti:
#     fieldnames = ["time","location","account","message","sentiment"]
#     writer = csv.DictWriter(senti, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
#     reader = csv.DictReader(data)

#     writer.writeheader()
                        
#         for row in reader:


#             else:
#                 writer.writerow(row)



