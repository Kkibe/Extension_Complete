getQuote();
$(document).ready(function(){
  $('#newQuote').click(function() {
     getQuote();
   });
});
  
function getQuote(){
   $.ajax({
          url: "https://api.forismatic.com/api/1.0/",
          jsonp: "jsonp",
          dataType: "jsonp",
          data: {
            method: "getQuote",
            lang: "en",
            format: "jsonp"
          },
          success : function(data){
           $("#quote").text(data.quoteText);
           $("#author").text(data.quoteAuthor);
          }
        })
}