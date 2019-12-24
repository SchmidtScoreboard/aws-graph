
const GraphQL = require('graphql');
const CommonFields = require('./Game');

const MLBType = new GraphQL.GraphQLObjectType({
    name: "mlb_game",
    description: "An instance of an MLB Game",
    fields: () => ({
        common: {
            type: CommonFields,
            description: "Fields common to all games"
        },
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
        },
        inning: {
            type: GraphQL.GraphQLInt,
            description: "The current inning"
        },
        is_inning_top: {
            type: GraphQL.GraphQLBoolean,
            description: "True if the game is at the top of the inning"
        }

    })
});

module.exports = MLBType;