app = {};
app.apiNumQuestions = 1;
app.apiCategory = undefined;
app.apiDifficulty = undefined;

app.apiCall = () => {
  $.ajax({
    url: 'https://opentdb.com/api.php',
    method: 'GET',
    dataType: 'json',
    data: {
      amount: app.apiNumQuestions,
      category: app.apiCategory,
      difficulty: app.apiDifficulty
    }
  }).then(
    data => {
      // if the response code is 0 then begins to parse the data, otherwise alerts that something went wrong
      if (data.response_code === 0) {
        console.log(data);
      } else {
        alert('something went wrong');
      }
    })
};