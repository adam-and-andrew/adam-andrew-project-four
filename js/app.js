app = {};
app.apiNumQuestions = 5;
app.apiCategory = undefined;
app.apiDifficulty = undefined;
app.questionCounter = 0;
app.turnCount = 1;
app.playerScore = {
  player1: 0,
  player2: 0,
  player3: 0,
  player4: 0
};

app.fontAwesome = {
  'General Knowledge': 'graduation-cap',
  'Entertainment: Books': 'book',
  'Entertainment: Film': 'video',
  'Entertainment: Music': 'music',
  'Entertainment: Musicals & Theatre': 'theatre-masks',
  'Entertainment: Television': 'tv',
  'Entertainment: Video Games': 'gamepad',
  'Entertainment: Board Games': 'dice-six',
  'Science & Nature': 'atom',
  'Science: Computers': 'laptop',
  'Science: Mathematics': 'calculator',
  Mythology: 'ankh',
  Sports: 'basket-ball',
  Geography: 'globe-americas',
  History: 'scroll',
  Politics: 'landmark',
  Celebrities: 'users',
  Animals: 'paw',
  Vehicles: 'car',
  'Entertainment: Comics': 'book-open',
  'Science: Gadgets': 'cogs',
  'Entertainment: Japanese Anime & Manga': 'user-ninja',
  'Entertainment: Cartoon & Animations': 'grin-tongue-squint'
};

// init to run app when document loaded and ready
app.init = () => {
  app.introScreen();
  app.instructions();
  app.playerTurnOutput();
  app.answerQuestion();
  app.nextQuestion();
  app.updateScore();
};

// Introduction screen form submission and proceeding to the game
app.introScreen = function() {
  $('.intro-form-submit').on('click', e => {
    // Get the information for the api call from the user for question category, question difficulty, and number of players
    app.apiCategory = $('#trivia-category').val();
    app.apiDifficulty = $('#trivia-difficulty').val();
    // get the number of players and convert string to number
    app.playerCount = parseInt($('#trivia-players').val());

    //updates the turn counter
    app.playerTurnOutput();

    //create score boxes
    app.createPlayers();

    // add additional questions based on number of players (5 extra per player)
    app.apiNumQuestions += app.playerCount * 5;

    if (app.category === null || app.apiDifficulty === null) {
      app.error('Please select a category and difficulty!');
    } else {
      app.apiCall();
      // fade out the intro screen and fades in the main game screen
      $('.intro-container').fadeOut();
      $('.quiz-container')
        .delay(800)
        .fadeIn();

      // resets the div container holding the game back to flexbox from display: none to be properly centered
      $('.quiz-container').css('display', 'flex');
    }
    // stop the submit button from refreshing the page when clicked
    e.preventDefault();
  });
};

app.createPlayers = function() {
  for (let i = 1; i <= app.playerCount; i++) {
    const playerScoreOutput = $('<p>').html(
      `Player ${i} Score: <br><span class="player${i}-score-output">0</span>`);

    const playerScoreBox = $('<div>')
      .addClass(`player${i}-score-box score-box`)
      .html(playerScoreOutput);
    $('.player-scores-container').append(playerScoreBox);
  }
};

app.playerTurnOutput = function() {
  if (app.playerCount === 1) {
    $('.player-turn').css('display', 'none');
  } else {
    $('.player-turn-output').html(app.turnCount);
  }
};

// Use the app.fontAwesome object to find the appriate font awesome icon class name from the selected category and return it
app.iconCategory = function(category) {
  return app.fontAwesome[category];
};

app.instructions = function() {
  $('.intro-show-instructions').on('click', e => {
    $('.instructions-modal').fadeIn();

    $('.instructions-close-button').on('click', () => {
      $('.instructions-modal').fadeOut();
    });

    e.preventDefault();
  });
};

app.error = function(message) {
  $('.error-modal').fadeIn();
  $('.error-modal-message').html(message);

  $('.error-close-button').on('click', () => {
    $('.error-modal').fadeOut();
  });
};

// function that calls API
app.apiCall = function() {
  $.ajax({
    url: 'https://opentdb.com/api.php',
    method: 'GET',
    dataType: 'json',
    data: {
      amount: app.apiNumQuestions,
      category: app.apiCategory,
      difficulty: app.apiDifficulty,
      type: 'multiple'
    }
  }).then(data => {
    // if the response code is 0 then begins to parse the data, otherwise alerts that something went wrong
    if (data.response_code === 0) {
      // retrieves the trivia questions from the api
      app.triviaQuestionsArray = data.results;

      app.askQuestions();

      // alert that something went wrong with the api
    } else if (data.response_code === 1) {
      app.error(
        `Sorry, Open Trivia DB doesn't have any results for your query.  Please try another selection.`
      );
    }
  });
};

// populate questions into the DOM from the array
app.askQuestions = function() { 
  const questionObject = app.triviaQuestionsArray[app.questionCounter];

  app.answer = questionObject.correct_answer;

  const question = questionObject.question;
  const category = questionObject.category;
  const incorrectAnswersArray = questionObject.incorrect_answers;
  const difficulty = questionObject.difficulty;

  // output question and category
  $('.trivia-question').html(question);

  // use the iconCategory function to place the appropriate icon for the displayed category
  $('.trivia-category').html(`<i class="fas fa-${app.iconCategory(category)}"></i> ${category}`);

  // print out question difficulty
  $('.trivia-difficulty').html(`Difficulty: (${difficulty})`);

  // create new array with both incorrect and correct answer
  possibleAnswersArray = incorrectAnswersArray.concat([app.answer]);
  possibleAnswersArray.sort();

  // loop through possible answers and output into input radio fields
  for (let i = 1; i <= possibleAnswersArray.length; i++) {
    $(`input#answer${i}`).attr('value', possibleAnswersArray[i - 1]);
    $(`label[for=answer${i}]`).html(possibleAnswersArray[i - 1]);
  }
};

// form submit when user answers a question
app.answerQuestion = function() {
  // listen for click on user submit
  $('#submit-answer-button').on('click', function(e) {
    // get the value of the player's answer
    playerAnswer = $('input[name=testRadio]:checked').val();
  
    // call function to check users answer
    app.checkAnswer(playerAnswer);
  
    e.preventDefault();
  });
}

// function that checks player answer
app.checkAnswer = function(answer) {
  // check if user's answer is correct
  if (answer === app.answer) {
    // adds to playerscore
    app.playerScore[`player${app.turnCount}`] += 1;
    app.updateScore();

    $('.answer-result-title').html('CORRECT');
    $('.answer-result-correct-answer').html('');
  } else {
    $('.answer-result-title').html('INCORRECT');
    $('.answer-result-correct-answer').html(`Correct Answer: ${app.answer}`);
  }

  $('.answer-form').fadeOut();
  $('.answer-result').delay(400).fadeIn();
};

app.updateScore = function() {
  $(`.player${app.turnCount}-score-output`).html(app.playerScore[`player${app.turnCount}`]);
};

// next question button
app.nextQuestion = function() {
  $('.answer-result-next-question').on('click', e => {
    // removed the checked property on the inputs
    $('.testRadio').prop('checked', false);

    // if there are unanswered questions in the array iterates the question counter and asks next question
    if (app.questionCounter + 1 < app.triviaQuestionsArray.length) {
      app.questionCounter++;
      $('.answer-result').fadeOut();
      $('.answer-form')
        .delay(400)
        .fadeIn();
      app.askQuestions();

      // if there are no more questions stops the game
    } else if (app.questionCounter + 1 === app.triviaQuestionsArray.length) {
      $('.gameover-modal').fadeIn();
    }

    // increases the turn counter or resets it based on number of players
    if (app.turnCount === app.playerCount) {
      app.turnCount = 1;
    } else if (app.turnCount < app.playerCount) {
      app.turnCount++
    };

    // update the turn count
    app.playerTurnOutput();
  });
};

$(function() {
  app.init();
});
