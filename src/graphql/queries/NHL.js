'use strict';
const GraphQL = require('graphql');
// import the Post type we created
const NHLType = require('../types/NHL');
// import the Post resolver we created
const NHLResolver = require('../resolvers/NHL');
module.exports = {
    index() {
        return {
            type: new GraphQL.GraphQLList(NHLType),
            description: 'This will return all the current NHL games.',
            args: {},
            resolve(parent, args, context, info) {
                return NHLResolver.index(args);
            }
        }
    },
};