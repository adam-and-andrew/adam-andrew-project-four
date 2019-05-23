app = {};
app.apiNumQuestions = 2;
app.apiCategory = undefined;
app.apiDifficulty = undefined;
app.questionCounter = 0;

// init to run app when document loaded and ready
app.init = () => {
  app.apiCall();
  app.introScreen();
  app.nextQuestion();
};

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

        app.askQuestions();

      } else {
        // alert that something went wrong with the api
        alert('something went wrong');
      }
    })
};

// populate questions into the DOM from the array
app.askQuestions = () => {
  const questionObject = app.triviaQuestionsArray[app.questionCounter];
  
  app.answer = questionObject.correct_answer;
  console.log(`Answer is:`, app.answer)

  const question = questionObject.question;
  const category = questionObject.category;
  const incorrectAnswersArray = questionObject.incorrect_answers;

  // output question and category
  $('.trivia-question').html(question);
  $('.trivia-category').html(category);

  // create new array with both incorrect and correct answer
  possibleAnswersArray = incorrectAnswersArray.concat([app.answer])
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

    // call function to check users answer
    app.checkAnswer(playerAnswer);

    e.preventDefault();
  });
};

// function that checks player answer
app.checkAnswer = (playerAnswer) => {
  // check if user's answer is correct
  if (playerAnswer === app.answer) {
    console.log(`YOU'RE RIGHT`)
    $('.answer-result-title').html('CORRECT');
    $('.answer-result-correct-answer').html('');
  } else {
    console.log(`WRONG`)
    $('.answer-result-title').html('INCORRECT');
    $('.answer-result-correct-answer').html(`Correct Answer: ${app.answer}`);
  }
  $('.answer-form').fadeOut()
  $('.answer-result').delay(400).fadeIn()
}

// next question button
app.nextQuestion = () => {
  $('.answer-result-next-question').on('click', (e) => {
    // removed the checked property on the inputs
    $('.testRadio').prop('checked', false);

    // if there are unanswered questions in the array iterates the question counter and asks next question
    if ((app.questionCounter + 1) < app.triviaQuestionsArray.length){
      app.questionCounter++;
      $('.answer-result').fadeOut();
      $('.answer-form').delay(400).fadeIn();
      app.askQuestions();

    // if there are no more questions stops the game
    } else if ((app.questionCounter + 1) === app.triviaQuestionsArray.length) {
      console.log('game over')
    };

  })
}

//Introduction screen form submission and proceeding to the game
app.introScreen = () => {
  $('.intro-form-submit').on('click', (e) => {

    //fade out the intro screen and fades in the main game screen
    $('.intro-container').fadeOut();
    $('.quiz-container').delay(400).fadeIn();

    //resets the div container holding the game back to flexbox from display: none to be properly centered
    $('.quiz-container').css('display', 'flex');

    //stop the submit button from refreshing the page when clicked
    e.preventDefault();
  });
}

$(function(){
  app.init();
});