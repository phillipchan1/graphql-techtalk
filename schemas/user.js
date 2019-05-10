const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;
const _ = require('lodash');
const axios = require('axios');
const userType = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: {
			type: GraphQLString
		},
		firstName: {
			type: GraphQLString
		},
		age: {
			type: GraphQLInt
		}
	}
});

const users = [
	{
		firstName: 'phil',
		age: 24,
		id: '1'
	},
	{
		firstName: 'joe',
		age: 29,
		id: '2'
	},
	{
		firstName: 'bob',
		age: 2,
		id: '3'
	},
	{
		firstName: 'lady',
		age: 21,
		id: '4'
	}
];

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: userType,
			args: {
				id: { type: GraphQLString }
			},
			resolve(parentValue, args) {
				return axios
					.get(`http://localhost:3000/users/${args.id}`)
					.then(res => res.data);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});
