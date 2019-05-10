const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;
const _ = require('lodash');
const companyType = new GraphQLObjectType({
	name: 'company',
	fields: {
		id: {
			type: GraphQLString
		},
		name: {
			type: GraphQLString
		},
		industry: {
			type: GraphQLString
		}
	}
});

const companyies = [
	{
		name: 'Microsoft',
		id: '1',
		industry: 'Tech'
	},
	{
		name: 'Bed Bath Beyond',
		id: '1',
		industry: 'Department'
	}
];

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		company: {
			type: companyType,
			args: {
				id: { type: GraphQLString }
			},
			resolve(parentValue, args) {
				return _.find(companies, {
					id: args.id,
					name: args.name
				});
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});
