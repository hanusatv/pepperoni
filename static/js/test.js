const get_answer_url = '/wordle/getanswer'
const submit_guess = '/wordle/submitguess'
const set_wordle_answer = '/wordle/setanswer'
const allowed_letters = ['a', 'á', 'b', 'd', 'ð', 'e', 'f', 'g', 'h', 'i', 'í', 'j', 'k', 'l', 'm', 'n', 'o', 'ó', 'p', 'r', 's', 't', 'u', 'ú', 'v', 'y', 'ý', 'æ', 'ø']
const notifications = ['Wuhu!! Tú vann!! UwU <3', 'Orðið finst ikki', "Øvv bubbu :'( orðið var: "]


var tryNo = 1

async function setWordleAnswer() {
  const response = await fetch(set_wordle_answer)
}

setWordleAnswer()

async function getWordleAnswer() {
  data = await fetch(get_answer_url)
  res = await data.text()
  return res
}


//setWordleAnswer()

// Fanga svarið sum er skriva inn
function collectGuess() {
  let collectedGuess = document.querySelectorAll(".active-row")
  let stringifyGuess = ""
  for (var i = 0; i < collectedGuess.length; i++) {
    stringifyGuess += collectedGuess[i].value
  }
  return stringifyGuess.toLowerCase()
}

function validateCollectedGuess(guessToValidate) {
  return guessToValidate.length === 5
}

async function postGuess(guessToPost) {
  const response = await fetch(submit_guess, {
    method: 'POST',
    body: JSON.stringify(guessToPost), // string or object
    headers: {
      'Content-Type': 'application/json'
    }
  });
  //const myJson = await response.json(); //extract JSON from the http response
  // do something with myJson
  const guessColorCoded = await response.json()
  if (guessColorCoded === false) {
    notificationHandler(1)
  }
  return (guessColorCoded)
}

function colorCodeMatrix(guessColorCoded) {
  let lettersToColor = document.querySelectorAll(".active-row")
  console.log(guessColorCoded)
  if (guessColorCoded === true) {
    for (let i = 0; i < lettersToColor.length; i++) {
      lettersToColor[i].classList.add("green-letter")
    }
  }
  else if (guessColorCoded === false) {
    return false
  }
  else {
    for (let colorKey in guessColorCoded) {
      if (guessColorCoded.hasOwnProperty(colorKey)) {
        let colorObj = guessColorCoded[colorKey]
        for (let key in colorObj) {
          if (colorObj.hasOwnProperty(key)) {
            let letter = colorObj[key]
            letter.forEach(position => {
              //console.log(position, colorKey)
              let varColor = ""
              if (colorKey == 'green') {
                varColor = "green-letter"
              }
              else if (colorKey == 'yellow') {
                varColor = "yellow-letter"
              }
              else {
                varColor = 'gray-letter'
              }
              //console.log(varColor)
              lettersToColor[position].classList.add(varColor)
            })
          }
        }
      }
    }
  }
}

function setActiveLetters() {
  let xActiveRow = document.querySelectorAll(".active-row")
  let activeRow = document.querySelectorAll(`.row-${tryNo}`)
  for (let i = 0; i < 5; i++) {
    if (xActiveRow.length != 0) {
      xActiveRow[i].classList.remove("active-row")
      xActiveRow[i].setAttribute("readonly", "")
    };
    if (tryNo < 7) {
      activeRow[i].classList.add("active-row")
      activeRow[i].removeAttribute("readonly", "")
    }
  }
  tryNo++
}

function correctGuess() {
  let allLetters = document.querySelectorAll(".active-row")
  for (let i = 0; i < allLetters.length; i++) {
    allLetters[i].setAttribute("readonly", "")
  }
  notificationHandler(0)
}

function notificationHandler(message) {
  let notifier = document.getElementById("notifier")
  let notificationMessage = document.getElementById("notification-message")
  notificationMessage.innerHTML = notifications[message]
  notifier.setAttribute("open", "")
  setTimeout(function () {
    notifier.removeAttribute("open", "")
  }, 3000)
}

async function gita() {
  //Checkar um tað er 7. ferð at gitt verður. Um tað er so return'a
  if (tryNo > 7) {
    return
  }
  //Fangar gitið sum er skrivað
  let guess = collectGuess()
  //Checkar um gitið er 5 karakterir. Um ikki, so return'a
  if (!validateCollectedGuess(guess)) {
    return
  }
  //Sendir gitið til backend
  let guessColorCoded = await postGuess(guess)
  //Checkar um gitið finst í orðalistanum. Umm ikki, so returna.
  if (!guessColorCoded) {
    return
  }

  colorCodeMatrix(guessColorCoded)

  if (guessColorCoded === true) {
    correctGuess()
    return
  }
  if (tryNo == 7) {
    correctWord = await getWordleAnswer()
    notifications[2] += correctWord
    notificationHandler(2)
  }
  setActiveLetters()
}



//Flyt focus frá einum input til næsta
//
var container = document.getElementsByClassName("wordle-grid-container")[0]
container.addEventListener('keyup', (e) => {
  let key = e.key
  let target = e.target
  if (allowed_letters.includes(key)) {
    let maxLength = parseInt(target.attributes["maxlength"].value, 10);
    let myLength = target.value.length;
    if (myLength >= maxLength) {
      let next = target;
      while (next = next.nextElementSibling) {
        if (next == null)
          break;
        if (next.tagName.toLowerCase() == "input") {
          next.focus();
          break;
        }
      }
    }
  }
})

//fanga 'Enter' key
document.addEventListener('keydown', (e) => {
  if (e.key == 'Enter') {
    gita()
  }
})

setActiveLetters();