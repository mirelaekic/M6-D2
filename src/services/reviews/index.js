/*
    MEDIUM PROJECT
    Today you continue building Medium API. 
    Backend needs to grant data persistance via MongoDB
    //BACKEND
    Your backend should now have the possibility to add a review to an
    article. Mongo's preferred data design should be to embed reviews into
    articles, therefore you should implement the following endpoints
    GET /articles/:id/reviews => returns all the reviews for the specified article
    GET /articles/:id/reviews/:reviewId => returns a single review for the specified article
    POST /articles/:id => adds a new review for the specified article
    PUT /articles/:id/reviews/:reviewId => edit the review belonging to the specified article
    DELETE /articles/:id/reviews/:reviewId => delete the review belonging to the specified article
    A review will look like:
    
        {
            "text": "string",
            "user": "string"
        }
        
    [EXTRA]
    
    Add pagination
    Add the possibility to search by title or by content with the same text field
*/

