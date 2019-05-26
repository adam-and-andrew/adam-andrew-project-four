// name space object
app = {};

// default number of questions starts at 5
app.apiNumQuestions = 5;

// question counter to iterate over the array of questions
app.questionCounter = 0;

// turn counter
app.turnCount = 1;

// object of all possible player scores
app.playerScore = {
  player1: 0,
  player2: 0,
  player3: 0,
  player4: 0
};

// object for font awesome icons for each trivia category
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
app.init = function() {
  app.introScreen();
  app.instructions();
  app.playerTurnOutput();
  app.answerQuestion();
  app.nextQuestion();
  app.updateScore();
};

// Introduction screen form submission and proceeding to the game
app.introScreen = function() {
  $('.intro-form-submit').on('click', function(e) {
    // Get the information for the api call from the user for question category, question difficulty, and number of players
    app.apiCategory = $('#trivia-category').val();
    app.apiDifficulty = $('#trivia-difficulty').val();
    
    // get the number of players and convert string to integer number
    app.playerCount = parseInt($('#trivia-players').val());

    //updates the turn counter
    app.playerTurnOutput();

    //create score boxes
    app.createPlayers();

    // add additional questions based on number of players (5 extra per player)
    app.apiNumQuestions += app.playerCount * 5;

    // validates that the user has made a selection
    if (app.category === null || app.apiDifficulty === null) {
      app.error('Please select a category and difficulty!');
    } else {
      // make api call with user selections
      app.apiCall();

    }

    e.preventDefault();
  });
};

// create the player scores at the bottom of the game page
app.createPlayers = function() {
  // loop over the total number of players and create divs
  for (let i = 1; i <= app.playerCount; i++) {
    const playerScoreOutput = $('<p>').html(
      `Player ${i} Score: <br><span class="player${i}-score-output">0</span>`
    );

    const playerScoreBox = $('<div>')
      .addClass(`player${i}-score-box score-box`)
      .html(playerScoreOutput);
    $('.player-scores-container').append(playerScoreBox);
  }
};

// output the turn counter at the bottom of the page
app.playerTurnOutput = function() {
  // if there is only one player the turn counter is hidden
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

// toggle the instructions modal on click
app.instructions = function() {
  $('.intro-show-instructions').on('click', function(e) {
    $('.instructions-modal').fadeIn();

    $('.instructions-close-button').on('click', function() {
      $('.instructions-modal').fadeOut();
    });

    e.preventDefault();
  });
};

// error modal that takes a message when called and displays that message
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
      // query parameters from user input
      amount: app.apiNumQuestions,
      category: app.apiCategory,
      difficulty: app.apiDifficulty,
      // only calls mutliple choice questions
      type: 'multiple'
    }
  }).then(data => {
    // if the response code is 0 then begins to parse the data, otherwise alerts that something went wrong
    if (data.response_code === 0) {
      // fade out the intro screen and fades in the main game screen
      $('.intro-container').fadeOut();
      $('.quiz-container')
        .delay(800)
        .fadeIn();

      // resets the div container holding the game back to flexbox from display: none to be properly centered
      $('.quiz-container').css('display', 'flex');

      // outputs the number of questions into the questions counter
      $('.trivia-question-total-output').html(app.apiNumQuestions);

      app.triviaQuestionsArray = data.results;

      app.askQuestions();

    } else if (data.response_code === 1) {
      app.error(
        `Sorry, Open Trivia DB doesn't have any results for your query. Please try another selection or combination.`
      );
    }
  });
};

// populate questions into the DOM from the array of questions returned
app.askQuestions = function() {
  // iterates through the array using the question counter to count index values
  const questionObject = app.triviaQuestionsArray[app.questionCounter];

  // saves the anwer to the question into the name space
  app.answer = questionObject.correct_answer;

  // grabs question data from question object
  const question = questionObject.question;
  const category = questionObject.category;
  const incorrectAnswersArray = questionObject.incorrect_answers;
  const difficulty = questionObject.difficulty;

  // output question and category
  $('.trivia-question').html(question);

  // use the iconCategory function to place the appropriate icon for the displayed category
  $('.trivia-category').html(
    `<i class="fas fa-${app.iconCategory(category)}" aria-hidden="true"></i> ${category}`
  );

  // output question difficulty
  $('.trivia-difficulty').html(`Difficulty: (${difficulty})`);

  // creates a new array with both incorrect and correct answer and sorts the array
  possibleAnswersArray = incorrectAnswersArray.concat([app.answer]);
  possibleAnswersArray.sort();

  // loops through possible answers and output them into input radio fields and their labels
  for (let i = 1; i <= possibleAnswersArray.length; i++) {
    $(`input#answer${i}`).attr('value', possibleAnswersArray[i - 1]);
    $(`label[for=answer${i}]`).html(possibleAnswersArray[i - 1]);
  }

  // print out the current question counter
  $('.trivia-question-counter-output').html(app.questionCounter + 1);
};

// submit when user answers a question
app.answerQuestion = function() {
  $('#submit-answer-button').on('click', function(e) {
    // get the value of the player's answer
    playerAnswer = $('input[name=answer-input-radio]:checked').val();

    // validates that the user has made a selection
    if (playerAnswer === undefined) {
      app.error(`Please select an answer.`);
    } else {
      // call function to check users answer
      app.checkAnswer(playerAnswer);
    }

    e.preventDefault();
  });
};

// function that checks player answer
app.checkAnswer = function(answer) {
  // check if user's answer is correct
  if (answer === app.answer) {
    // adds to player's score
    app.playerScore[`player${app.turnCount}`] += 1;
    app.updateScore();

    // ouputs if they are correct
    $('.answer-result-title').html('CORRECT');
    $('.answer-result-correct-answer').html('');
  } else {
    // outputs if they're incorrect and the correct answer
    $('.answer-result-title').html('INCORRECT');
    $('.answer-result-correct-answer').html(`Correct Answer: ${app.answer}`);
  }

  // hides answer form and displays answer results
  $('.answer-form').fadeOut();
  $('.answer-result')
    .delay(400)
    .fadeIn();
};

// outputs updated player score to DOM
app.updateScore = function() {
  $(`.player${app.turnCount}-score-output`).html(app.playerScore[`player${app.turnCount}`]);
};

// next question button
app.nextQuestion = function() {
  $('.answer-result-next-question').on('click', function(e) {
    // removed the checked property on the inputs
    $('.answer-input-radio').prop('checked', false);

    // if there are unanswered questions in the array iterates the question counter and asks next question in array
    if (app.questionCounter + 1 < app.triviaQuestionsArray.length) {
      app.questionCounter++;
      $('.answer-result').fadeOut();
      $('.answer-form')
        .delay(400)
        .fadeIn();

      app.askQuestions();

      // if there are no more questions stops the game
    } else if (app.questionCounter + 1 === app.triviaQuestionsArray.length) {
      app.gameOver();
    }

    // increases the turn counter or resets it based on number of players
    if (app.turnCount === app.playerCount) {
      app.turnCount = 1;
    } else if (app.turnCount < app.playerCount) {
      app.turnCount++;
    }

    // update the turn count
    app.playerTurnOutput();
  });
};

// game over display
app.gameOver = function() {
  // if there is only one player output their score
  if (app.playerCount === 1) {
    $('.gameover-modal-score').html(
      `You got ${app.playerScore.player1} out of ${app.apiNumQuestions} questions.`
    );
    // output all players score if there is more than one player
  } else {
    // convert score object to array of scores
    const scores = Object.values(app.playerScore);

    // loop over array and output only the number of players in the game
    for (let i = 0; i < app.playerCount; i++) {
      // uses the same classes from when the player scores are created in the DOM
      const playerScoreOutput = $('<p>').html(
        `Player ${i + 1} Score: <br><span class="player${i + 1}-score-output">${scores[i]}</span>`
      );
        
      const playerScoreBox = $('<div>')
        .addClass(`player${i}-score-box score-box`)
        .html(playerScoreOutput);

      // output scores to the game modal
      $('.gameover-modal-score').append(playerScoreBox);
    }
  }

  // show the gameover modal
  $('.gameover-modal')
    .delay(800)
    .fadeIn();

  $('.gameover-reset-button').on('click', function() {
    location.reload(true);
  });
};

$(function() {
  app.init();
});





