import json
import re
import random
import os

DB_DIR = "static/database"

# Ger ein lista við øllum valid guesses
file = open("static/database/validGuesses.json", encoding="utf-8")
validGuesses = json.load(file)
file.close()
a = (map(lambda x: x.lower(), validGuesses))
validGuesses = list(a)

# Ger ein lista við øllum valid wordl
file = open("static/database/wordlist.json", encoding="utf-8")
wordlist = json.load(file)
file.close()
a = (map(lambda x: x.lower(), wordlist))
wordlist = list(a)


def colorCodeLettersInGuess(answer, guess):
    # Kanna um svarið er rætt
    if guess == answer:
        return True

    # Finn grønir bókstavir
    colorCoded = {"green": {}, "yellow": {}, "white": {}}
    for i, letter in enumerate(guess):
        if letter == answer[i]:
            if letter in colorCoded["green"]:
                colorCoded["green"][letter].append(i)
            else:
                colorCoded["green"][letter] = [i]

    # Finn gulir og hvítir bókstavir
    for i, letter in enumerate(guess):
        if guess[i] in answer:
            greenNo = 0
            yellowNo = 0
            if letter in colorCoded["green"].keys():
                if i in colorCoded["green"][letter]:
                    continue
                else:
                    greenNo = len(colorCoded["green"][letter])
            if letter in colorCoded["yellow"].keys():
                yellowNo = len(colorCoded["yellow"][letter])
            if greenNo + yellowNo < answer.count(letter):
                if letter in colorCoded["yellow"]:
                    colorCoded["yellow"][letter].append(i)
                else:
                    colorCoded["yellow"][letter] = [i]
            else:
                if letter in colorCoded["white"]:
                    colorCoded["white"][letter].append(i)
                else:
                    colorCoded["white"][letter] = [i]
        else:
            if letter in colorCoded["white"]:
                colorCoded["white"][letter].append(i)
            else:
                colorCoded["white"][letter] = [i]
    return (colorCoded)


def filterValidGuesses(coloredGuess, filteredList, guess):
    regExList = ["", "", "", "", ""]
    regExBuffer = ["", "", "", "", ""]
    regExLookAhead = {}
    greenLetters = coloredGuess["green"].keys()
    yellowLetters = coloredGuess["yellow"].keys()
    whiteLetters = coloredGuess["white"].keys()
    # Forlanga allar grønar í positiónini
    for key in greenLetters:
        regExLookAhead[key] = len(coloredGuess["green"][key])
        for pos in coloredGuess["green"][key]:
            regExList[pos] = key
    # Útilukka allar gular frá positiónini
    for key in yellowLetters:
        if key in regExLookAhead:
            regExLookAhead[key] += len(coloredGuess["yellow"][key])
        else:
            regExLookAhead[key] = len(coloredGuess["yellow"][key])
        for pos in coloredGuess["yellow"][key]:
            regExBuffer[pos] += key
    # Útilukka hvítar frá positiónini um gulur til staðar
    for key in whiteLetters:
        if key in yellowLetters:
            for pos in coloredGuess["white"][key]:
                regExBuffer[pos] += key
        # Útilukka heilt um gulir ikki til staðar
        else:
            for i, pos in enumerate(regExBuffer):
                regExBuffer[i] += key
    # Smekka filtur letters í regex positiónir
    for i, filter in enumerate(regExBuffer):
        if regExList[i] == "":
            regExList[i] = f'[^{regExBuffer[i]}]'

    regExLookAheadParsed = ""
    for key in regExLookAhead:
        regExLookAheadParsed += f'(?=((.*{key}.*){{{regExLookAhead[key]}}}))'

    # Set strongin saman
    regExString = regExLookAheadParsed + "".join(regExList)
    pattern = re.compile(regExString)
    filteredValidGuesses = []
    for word in filteredList:
        if re.fullmatch(pattern, word):
            filteredValidGuesses.append(word)
    return filteredValidGuesses


def averageRun(plays):
    noOfGuesses = []
    for n in range(plays):
        if n % 100 == 0:
            print(n)
        t = playWordle()
        noOfGuesses.append(t)
    print(sum(noOfGuesses) / len(noOfGuesses))
    larger_elements = [element for element in noOfGuesses if element > 6]
    print("Failure rate is", len(larger_elements) / len(noOfGuesses))


def playWordle():
    wordle = random.choice(wordlist)
    filteredList = validGuesses
    guessNo = 0
    coloredGuess = False
    while coloredGuess != True:
        guess = random.choice(filteredList)
        print(guess)
        guessNo += 1
        coloredGuess = colorCodeLettersInGuess(wordle, guess)
        if coloredGuess == True:
            return guessNo
        filteredList = filterValidGuesses(coloredGuess, filteredList, guess)


def setAnswer():
    file = open("static/database/wordlist.json", encoding="utf-8")
    wordlist = json.load(file)
    file.close()
    a = (map(lambda x: x.lower(), wordlist))
    wordlist = list(a)
    return random.choice(wordlist)
