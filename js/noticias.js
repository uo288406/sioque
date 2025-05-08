class Noticias {

    constructor(){
        this.generateNews();
    }

    generateNews() {
        const apikey = 'dfd7ce26f774f94a3701efb77b33fa27';
        const url = 'https://gnews.io/api/v4/search?q=Noreña&lang=es&country=es&max=5&apikey=' + apikey;
        
        fetch(url)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            const articles = data.articles;
        
            var body = $("body");
            
            for (var i = 0; i < articles.length; i++) {
                var article = $("<article></article>");

                article.append($(`<h3>${articles[i].title}</h3>`));
                console.log("Title: " + articles[i]['title']);

                article.append($(`<p>${articles[i].description}</p>`));
                console.log("Description: " + articles[i]['description']);    
              
                body.append(article);
            }
          });
    }
}