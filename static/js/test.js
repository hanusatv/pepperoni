const get_answer_url = '/wordle/getanswer'
const submit_guess = '/wordle/submitguess'

var tryNo = 1

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
  return (guessColorCoded)
}

function colorCodeMatrix(guessColorCoded) {
  let lettersToColor = document.querySelectorAll(".active-row")
  if (guessColorCoded === true) {
    for (let i = 0; i < lettersToColor.length; i++) {
      lettersToColor[i].classList.add("green-letter")
    }
  }
  else {
    for (let colorKey in guessColorCoded) {
      if (guessColorCoded.hasOwnProperty(colorKey)) {
        let colorObj = guessColorCoded[colorKey]
        for (let key in colorObj) {
          if (colorObj.hasOwnProperty(key)) {
            let letter = colorObj[key]
            letter.forEach(position => {
              console.log(position, colorKey)
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
              console.log(varColor)
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
  for (var i = 0; i < 5; i++) {
    if (xActiveRow.length != 0) {
      xActiveRow[i].classList.remove("active-row")
      xActiveRow[i].setAttribute("readonly", "")
    };
    if (tryNo < 7) {
      activeRow[i].removeAttribute("readonly", "")
      activeRow[i].classList.add("active-row")
    }
  }
  tryNo++
}


async function gita() {
  if (tryNo > 7) {
    return
  }
  let guess = collectGuess()
  if (!validateCollectedGuess(guess)) {
    return
  }
  let guessColorCoded = await postGuess(guess)
  colorCodeMatrix(guessColorCoded)
  setActiveLetters()
}


setActiveLetters();