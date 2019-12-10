'use strict';
const GraphQL = require('graphql');
const {
	GraphQLString,
	GraphQLID,
} = GraphQL;
const TeamType = new GraphQL.GraphQLObjectType({
	name: 'Team',
	description: 'Information representing a specific team',
	fields: () => ({
		id: {
			type: GraphQLID,
			description: 'The ID for a specific team',
		},
		city: {
			type: GraphQLString,
			description: 'The city for a team'
		},
		name: {
			type: GraphQLString,
			description: 'The full team name'
		},
		display_name: {
			type: GraphQLString,
			description: 'Possibly a shorter name to be displayed on scoreboard',
		},
		abbreviation: {
			type: GraphQLString,
			description: "Abbreviation of team name",
		},
		primary_color: {
			type: GraphQLString,
			description: "Hex color for the team primary color"
		},
		secondary_color: {
			type: GraphQLString,
			description: "Hex color for the team secondary color"
		},
	})
});
module.exports = TeamType;