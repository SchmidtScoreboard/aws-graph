const GraphQL = require('graphql');
const TeamType = require('./Team');
const GameStatus = require('./GameStatus');


const CommonFields = new GraphQL.GraphQLObjectType({
    name: "common",
    description: "Fields common to all games",
    fields: () => ({
        away_team: {
            type: TeamType,
            description: "The info for the away team"
        },
        home_team: {
            type: TeamType,
            description: "The info for the home team"
        },
        away_score: {
            type: GraphQL.GraphQLInt,
            description: "The away team's score"
        },
        home_score: {
            type: GraphQL.GraphQLInt,
            description: "The home team's score"
        },
        ordinal: {
            type: GraphQL.GraphQLString,
            description: "The string representing the period, inning, quarter, or half"
        },
        status: {
            type: GameStatus,
            description: "The status of this game"
        },
        start_time: {
            type: GraphQL.GraphQLString,
            description: "The time this game will start at UTC"
        },
        id: {
            type: GraphQL.GraphQLID,
            description: "The id for accessing this specific game"

        }
    })
});
module.exports = CommonFields;