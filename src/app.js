'use strict';
const express = require('express');
const body_parser = require('body-parser');
const expressGraphQL = require('express-graphql');
const GraphQL = require('graphql');
// let's import the schema file we just created
const NHLQuery = require('./graphql/queries/NHL');
const MLBQuery = require('./graphql/queries/MLB');

const app = express();
app.use(body_parser.json({ limit: '50mb' }));
app.use(
    '/nhl',
    expressGraphQL(() => {
        return {
            graphiql: true,
            schema: new GraphQL.GraphQLSchema({
                query: new GraphQL.GraphQLObjectType({
                    name: 'NHLQueryType',
                    description: 'This is the NHL Query',
                    fields: {
                        games: NHLQuery.index(),
                    },
                })
            }),
        }
    })
);
app.use(
    '/mlb',
    expressGraphQL(() => {
        return {
            graphiql: true,
            schema: new GraphQL.GraphQLSchema({
                query: new GraphQL.GraphQLObjectType({
                    name: 'MLBQueryType',
                    description: 'This is the MLB Query',
                    fields: {
                        games: MLBQuery.index(),
                    },
                })
            }),
        }
    })
);
module.exports = app;