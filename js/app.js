app = {};
app.apiNumQuestions = 1;
app.apiCategory = undefined;
app.apiDifficulty = undefined;

// init to run app when document loaded and ready
app.init = () => {
  app.apiCall();
}

// function that calls API
app.apiCall = () => {
  $.ajax({
    url: 'https://opentdb.com/api.php',
    method: 'GET',
    dataType: 'json',
    data: {
      amount: app.apiNumQuestions,
      category: app.apiCategory,
      difficulty: app.apiDifficulty,
      type: "multiple"
    }
  }).then(
    data => {
      // if the response code is 0 then begins to parse the data, otherwise alerts that something went wrong
      if (data.response_code === 0) {
        // retrieves the trivia questions from the api
        app.triviaQuestionsArray = data.results;

        app.askQuestions(app.triviaQuestionsArray);

      } else {
        // alert that something went wrong with the api
        alert('something went wrong');
      }
    })
};

// populate questions into the DOM from the array
app.askQuestions = (questionsArray) => {
  // console.log(questionsArray);

  const firstQuestionObject = questionsArray[0];
  const question = firstQuestionObject.question;
  const category = firstQuestionObject.category;
  const incorrectAnswersArray = firstQuestionObject.incorrect_answers;
  const answer = firstQuestionObject.correct_answer;

  // output question and category
  $('.trivia-question').html(question);
  $('.trivia-category').html(category);

  // create new array with both incorrect and correct answer
  possibleAnswersArray = incorrectAnswersArray.concat([answer])
  possibleAnswersArray.sort()

  // loop through possible answers and output into input radio fields
  for(let i = 1; i <= possibleAnswersArray.length; i++) {
    $(`input#answer${i}`).attr('value', possibleAnswersArray[i - 1]);
    $(`label[for=answer${i}]`).html(possibleAnswersArray[i - 1]);
  }

  // listen for click on user submit
  $('#submit-answer-button').on('click', (e) => {
    // get the value of the player's answer
    playerAnswer = $('input[name=testRadio]:checked').val();
    console.log(playerAnswer)
    console.log(answer)
    
    // check if user's answer is correct
    if( playerAnswer === answer) {
      console.log(`YOU'RE RIGHT`)
    } else {
      console.log(`WRONG`)
    }

    e.preventDefault();
  });


    // START AT 0
  // WHILE LOOP (UNTIL COUNTER REACHES # QUESTIONS)
    // ASK QUESTION
    // USER ANSWERS
    // CHECK IF CORRECT
    // USER CLICKS NEXT
    // CYCLES TO NEXT QUESTION (QUESTIONS COUNTER +1)

};

$(function(){
  app.init();
});