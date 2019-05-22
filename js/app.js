app = {};
app.apiNumQuestions = 5;
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
  console.log(questionsArray);

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