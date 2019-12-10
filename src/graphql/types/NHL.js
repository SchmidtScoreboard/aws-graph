
const GraphQL = require('graphql');
const CommonFields = require('./Game');

const NHLType = new GraphQL.GraphQLObjectType({
    name: "nhl_game",
    description: "An instance of an NHL Game",
    fields: () => ({
        common: {
            type: CommonFields,
            description: "Fields common to all games"
        },
        away_powerplay: {
            type: GraphQL.GraphQLBoolean,
            description: "True if the away team has a powerplay"
        },
        home_powerplay: {
            type: GraphQL.GraphQLBoolean,
            description: "True if the home team has a powerplay"
        },
        away_players: {
            type: GraphQL.GraphQLInt,
            description: "Number of skaters for the away team"
        },
        home_players: {
            type: GraphQL.GraphQLInt,
            description: "Number of players for the home team"
        },
    })
});

module.exports = NHLType;