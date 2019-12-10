const GraphQL = require('graphql');

const GameStatus = new GraphQL.GraphQLEnumType({
    name: "GameStatus",
    values: {
        INVALID: { value: 0 },
        PREGAME: { value: 1 },
        ACTIVE: { value: 2 },
        INTERMISSION: { value: 3 },
        END: { value: 4 },
    }
});

module.exports = GameStatus;