var express = require('express');
var expressGraphQL = require('express-graphql');
var { graphql, buildSchema } = require('graphql');
const schema = require('./schema/schema');



var app = express();
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true

}));


app.listen(process.env.PORT, process.env.IP, () => {
    console.log("server running", "v0.0.01", "IP:PORT", process.env.IP, process.env.PORT);
});
