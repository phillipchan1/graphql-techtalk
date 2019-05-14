const express = require('express')
const app = express()
const userSchema = require('./schemas')

const expressGraphQL = require('express-graphql')

app.use(
    '/graphql',
    expressGraphQL({
        schema: userSchema,
        graphiql: true,
    })
)

app.listen(4000, () => {
    console.log('listening on 4000')
})
