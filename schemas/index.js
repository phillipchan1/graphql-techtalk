const graphql = require('graphql')
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
} = graphql
const axios = require('axios')

const companyType = new GraphQLObjectType({
    name: 'company',
    fields: () => ({
        id: {
            type: GraphQLString,
        },
        name: {
            type: GraphQLString,
        },
        size: {
            type: GraphQLString,
        },
        user: {
            type: new GraphQLList(userType),
            resolve(parentValue, args) {
                return axios
                    .get(
                        `http://localhost:3000/companies/${
                            parentValue.id
                        }/users`
                    )
                    .then(res => res.data)
            },
        },
    }),
})

const companyRootQuery = {
    type: companyType,
    args: {
        id: { type: GraphQLString },
    },
    resolve(parentValue, args) {
        console.log('args', args)
        return axios
            .get(`http://localhost:3000/companies/${args.id}`)
            .then(res => res.data)
    },
}

const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {
            type: GraphQLString,
        },
        firstName: {
            type: GraphQLString,
        },
        age: {
            type: GraphQLInt,
        },
        friends: {
            type: new GraphQLList(userType),
            resolve(parentValue, args) {
                const friendsList = parentValue.friends

                return axios.get(`http://localhost:3000/users`).then(res => {
                    return res.data.filter(user => {
                        return friendsList.includes(user.id)
                    })
                })
            },
        },
        company: {
            type: companyType,
            resolve(parentValue, args) {
                return axios
                    .get(
                        `http://localhost:3000/companies/${
                            parentValue.companyId
                        }`
                    )
                    .then(res => res.data)
            },
        },
    }),
})

const usersRootQuery = {
    type: new GraphQLList(userType),
    resolve() {
        return axios.get(`http://localhost:3000/users/`).then(res => res.data)
    },
}

const companiesRootQuery = {
    type: new GraphQLList(companyType),
    resolve() {
        return axios
            .get(`http://localhost:3000/companies/`)
            .then(res => res.data)
    },
}

const userRootQuery = {
    type: userType,
    args: {
        id: { type: GraphQLString },
    },
    resolve(parentValue, args) {
        return axios
            .get(`http://localhost:3000/users/${args.id}`)
            .then(res => res.data)
    },
}

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: userType,
            args: {
                firstName: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt),
                },
                companyId: {
                    type: GraphQLString,
                },
            },
            resolve(parentValue, { firstName, age }) {
                axios
                    .post(`http://localhost:3000/users/`, {
                        firstName,
                        age,
                    })
                    .then(res => {
                        console.log(res.data)
                        return res.data
                    })
            },
        },
    },
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: userRootQuery,
        company: companyRootQuery,
        users: usersRootQuery,
        companies: companiesRootQuery,
    },
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
})
