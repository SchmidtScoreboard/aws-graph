'use strict';
const GraphQL = require('graphql');
// import the Post type we created
const MLBType = require('../types/MLB');
// import the Post resolver we created
const MLBResolver = require('../resolvers/MLB');
module.exports = {
    index() {
        return {
            type: new GraphQL.GraphQLList(MLBType),
            description: 'This will return all the current MLB games.',
            args: {},
            resolve(parent, args, context, info) {
                return MLBResolver.index(args);
            }
        }
    },
};