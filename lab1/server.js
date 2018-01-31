var { graphql, buildSchema } = require('graphql');


var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

//root is a resolver

var root = {
    hello: () => {
        return "Hello GraphQL"
    }
};


graphql(schema, '{hello}', root).then(
    (response) =>{
        console.log("graphql","server", "response", response);
    }
);