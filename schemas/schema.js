const GraphQL = require('graphql');
// const _ = require('lodash'); // static data
const axios = require('axios');
const {
      GraphQLObjectType,
      GraphQLString,
      GraphQLInt,
      GraphQLSchema
} = GraphQL;

// static data
// const usersMock = [
      // { id: '12', firstname:'Sunil Garol', age:15 },
      // { id: '21', firstname:'Oscar Garol', age:20 }
// ]

const userType = new GraphQLObjectType({
      name: 'User',
      fields: {
            id: { type: GraphQLString },
            firstname: { type: GraphQLString } ,
            age: { type: GraphQLInt }
      }
})

const RootQuery =new GraphQLObjectType({
      name: 'RootQueryType',
      fields:{
            user:{ // 1. if you're looking for an user
                  type: userType, // 3. I will return you an user
                  args: {  id: { type: GraphQLString } }, // 2. So give me an Id
                  resolve(parentValue, args) {
                        // return _.find(usersMock, { id: args.id }); // static data
                        return axios.get(`http://localhost:3000/users/${args.id}`)
                        .then( response => response.data );
                  }
            }

      }
})

module.exports = new GraphQLSchema ({
      query: RootQuery
})