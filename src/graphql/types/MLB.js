
const GraphQL = require('graphql');
const CommonFields = require('./Game');

const MLBType = new GraphQL.GraphQLObjectType({
    name: "mlb_game",
    description: "An instance of an MLB Game",
    fields: () => ({
        CommonFields,
        outs: {
            type: GraphQL.GraphQLInt,
            description: "The number of outs currently"
        },
        balls: {
            type: GraphQL.GraphQLInt,
            description: "The number of outs currently"
        },
        strikes: {
            type: GraphQL.GraphQLInt,
            description: "The number of outs currently"
        }
    })
});

module.exports = MLBType;