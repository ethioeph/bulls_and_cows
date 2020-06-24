
document.addEventListener('DOMContentLoaded', function() {
  var wordCount = 10;
  var guessCount = 4;
  var password = '';

  //toggles to the game-screen when the 'start' button is pressed
  d3.select("#start")
    .on("click", function() {
      toggleClasses(d3.select('#start-screen'), 'hide', 'show');
      toggleClasses(d3.select('#game-screen'), 'hide', 'show');
      startGame();      
    })

  //used to toggle between two class names.
  function toggleClasses(selection) {  
    //first and second arguments are 'hide' and 'show'.
    for (var i = 1; i < arguments.length; i++) {
      var classIsSet = selection.classed(arguments[i]);
      selection.classed(arguments[i], !classIsSet);
    }
  }

  //used to generate a random 4 digit number
  function getRandomFourDigitValue() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  var password;

  function startGame() {
    //obtain a random 4 digit password
    password = getRandomFourDigitValue();

    //updates the state whenever the 'try' button is clicked.
    var tryButton = d3.select("#try");
    tryButton.on('click', updateState);
  }
    
  //updates the DOM with information about the number of bulls and cows resulting from the guess. 
  function updateState(){  
    var numberGuess = d3.select("#number-guess");

    d3.event.preventDefault();
    d3.selectAll(".bull-cow").remove();
    d3.selectAll(".warning-message").remove();

    //checking the guess is valid and updating the DOM with appropriate # of bulls and cows 
    checkGuessDigits(numberGuess.property("value"));
    updateBullsAndCows(numberGuess.property("value"));
        
    //empty the search field after a guess
    numberGuess.property("value","");
  }

  //checks if the guess is a valid 4 digit number 
  function checkGuessDigits(guess){
    let num = parseInt(guess,10);//convert to base 10 integer

    if(guess.length != 4 || num === NaN){
      d3.select("#warning-message")
        .append('p')
          .classed('warning-message',true)
          .text('Please enter a 4 digit number');
    }    
  }  

  //updating the selected solution.
  function updateBullsAndCows(guess){
    let num = parseInt(guess,10);
    let numArray = Array.from(guess).map(Number);
    let passwordArray = Array.from(password.toString()).map(Number);

    let bullCount = 0, cowCount = 0;
    if(guess.length == 4 && num != NaN){
      //calculating the number of bulls and cows.
      for(let i = 0; i < 4; i++){    
        for(let j = 0; j < 4; j++){
          if(numArray[i] === passwordArray[j]){
            if(i==j){
              //found bull
              bullCount++;
              break;
            }
            else{
              //found cow
              passwordArray[j] = '#';//replacing existing number with unique key to prevent overcounting
              cowCount++;
              break;
            }
          }
        }
      }

      //remove request to keep trying and congratulate the user + prompt if they wish to play again.  
      if(bullCount === 4) {
        d3.select("#motivation").remove();
        toggleClasses(d3.select("#winner"), 'hide', 'show')
      }

      //report appropriate number of bulls and cows. 
      d3.select("#guess-result")                        
      .append('p')
        .classed('bull-cow',true)
        .text(bullCount + " bulls & " + cowCount + " cows");
    }
    else { 
      //by default, show 0 bulls and 0 cows for incorrectly formatted input.
      d3.select("#guess-result")                        
      .append('p')
        .classed('bull-cow',true)
        .text(0 + " bulls & " + 0 + " cows");

    }
  }
});