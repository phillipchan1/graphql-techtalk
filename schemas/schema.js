const graphql = require('graphql')

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql
const _ = require('lodash')
const axios = require('axios')

const companyType = new GraphQLObjectType({
    name: 'company',
    fields: {
        id: {
            type: GraphQLString,
        },
        name: {
            type: GraphQLString,
        },
        industry: {
            type: GraphQLString,
        },
    },
})

const userType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {
            type: GraphQLString,
        },
        firstName: {
            type: GraphQLString,
        },
        age: {
            type: GraphQLInt,
        },
    },
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: userType,
            args: {
                id: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                return axios
                    .get(`http://localhost:3000/users/${args.id}`)
                    .then(res => res.data)
            },
        },
        company: {
            type: companyType,
            args: {
                id: {
                    type: GraphQLString,
                },
            },
            resolve(parentValue, args) {
                return axios
                    .get(`http://localhost:3000/companies/${args.id}`)
                    .then(res => res.data)
            },
        },
    },
})

module.exports = new GraphQLSchema({
    query: RootQuery,
})
