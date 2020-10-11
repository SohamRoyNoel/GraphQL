const express = require('express');
const { graphqlHTTP  } = require('express-graphql');
const schema = require('./schemas/schema') ;

var app = express();

// whatever route comes with /graphql we will say to handle it by GraphQL query
app.use('/graphql', graphqlHTTP ({
      schema: schema,
      graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'))