# grpc-node-poc

in this poc i will try to test the performance of using grpc node vs rest api. in the world of micro services.
we will try to create 2 project identical as posibale seperate only by the comunication layer.

we will use this use case to illustrate all the four API types supported by gRPC: 
* Unary 
* Server streaming 
* Client streaming 
* Bidirectional streaming

# The requiremnets

Each project should impliment a Movie Finder application that provides a personalized movie recommendation based on the genre input received from the user.

The application, on receiving the request, fetches the list of movies categorized by the genre,
then matches it against the user preferences and finally passes it over a recommendation engine to suggest a movie response back to the user.
A total of four microservices will be built for this solution. 
All interactions between the microservices.

# The Solution View gRpc

Each microservice will be running a separate gRPC server. This is a design choice. The general recommended practice is to have dedicated servers sitting behind load balancers for each microservice.

Movie Finder – An external service that publishes API for client/ UI  to interact with the application writen as rest api just fro testing.
                but calles the internal services using gRPC

Movie store – Holds a database of movie records. This can be thought of as something like omdb.org 
              will stream movies to the response each time it ready.

User Preferences – Keeps track of user perefrences. For simplicity, we can will use the movie rating to filter the user movies perefrernces.
                   will get a stream of movies check if its eligible and strem eligible movies to the response. 

Recommender – The component that holds all the logic for making a  movie recommendation.
              wait for all movies pass thought and will choose a single movie.
              
# The Solution View REST

Each microservice will be running a separate express server. This is a design choice. The general recommended practice is to have dedicated servers sitting behind load balancers for each microservice.

Movie Finder – An external service that publishes API for client/ UI to interact with the application calles the internal services using REST.

Movie store – Holds a database of movie records. This can be thought of as something like omdb.org 
              will send response when all eligible movies are ready.

User Preferences – Keeps track of user perefrences. For simplicity, we can will use the movie rating to filter the user movies perefrernces.
                   will send  a response when all eligible movies are ready. 

Recommender – The component that holds all the logic for making a movie recommendation.
              get the movie list and choose a single movie.               
