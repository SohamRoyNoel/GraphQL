const GraphQL = require('graphql');
// const _ = require('lodash'); // static data
const axios = require('axios');
const { response } = require('express');
const {
      GraphQLObjectType,
      GraphQLString,
      GraphQLInt,
      GraphQLSchema,
      GraphQLList,
      GraphQLNonNull
} = GraphQL;


const companyType = new GraphQLObjectType({
      name: 'Company',
      fields: () => ({ // To handle CIRCULAR reference: as usertype is not defined here
            id: { type: GraphQLString },
            name: { type: GraphQLString } ,
            description: { type: GraphQLString },
            users: {
                  type: new GraphQLList(userType), // ! company has multiple employee:: To establish 1 to M relation
                  resolve(parentValue, args) {
                        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                        .then(response => response.data);
                  }
            }
      })
})

const userType = new GraphQLObjectType({
      name: 'User',
      fields: () => ({
            id: { type: GraphQLString },
            firstname: { type: GraphQLString } ,
            age: { type: GraphQLInt },
            company: {
                  type: companyType,
                  resolve(parentValue, args) {
                        // console.log(parentValue, args); //{ id: '12', firstname: 'Sunil Garol', age: 15, companyId: '2' } {}
                        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                        .then(response => response.data);
                  }
            },
      })
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
            },
            company:{ // 1. if you're looking for an user
                  type: companyType, // 3. I will return you an user
                  args: {  id: { type: GraphQLString } }, // 2. So give me an Id
                  resolve(parentValue, args) {
                        // return _.find(usersMock, { id: args.id }); // static data
                        return axios.get(`http://localhost:3000/companies/${args.id}`)
                        .then( response => response.data );
                  }
            } 
      }
})

// POST & PUT & DELETE
const mutation = new GraphQLObjectType({
      name: 'Mutation',
      fields: {
            addUser: {
                  type: userType,
                  args: {
                        firstname: { type: GraphQLNonNull(GraphQLString) } ,
                        age: { type: GraphQLNonNull(GraphQLInt) },
                        companyId: { type: GraphQLString }
                  },
                  resolve(parentValue, { firstname, age }) {
                        return axios.post(`http://localhost:3000/users`, { firstname, age })
                        .then(res => res.data);
                  }
            },
            deleteUser: {
                  type: userType,
                  args: {
                         id: { type: GraphQLString },
                  },
                  resolve(parentValue, { id }) {
                        return axios.delete(`http://localhost:3000/users/${ id }`)
                        .then(res => res.data);
                  }
            },
            editUser: {
                  type: userType,
                  args: {
                        id: { type: GraphQLString },
                        firstname: { type: GraphQLNonNull(GraphQLString) } ,
                        age: { type: GraphQLNonNull(GraphQLInt) }
                  },
                  resolve(parentValue, { id, firstname, age }) {
                        return axios.patch(`http://localhost:3000/users/${ id }`, { firstname, age })
                        .then(res => res.data);
                  }
            }
      }
})

module.exports = new GraphQLSchema ({
      query: RootQuery,
      mutation: mutation
})

/*
* Difference between PUT vs PATCH
* PUT: takes down the real model and changes to given
Main model : {
  "id": "21",
  "firstname": "Jim Garol",
  "age": 20,
  "companyId": "2"
}
request query:
mutation {
  editUser(id:"22", firstname:"Bokachor Sunil r chamcha Oscar", age:108) {
    id,
    firstname,
    age
  }
}
O/P:
Main model : {
  "id": "21",
  "firstname": "Jim Garol",
  "age": 20
}
* PATCH: updates specific

keeps the COMPANY ID ATTRIBUTE
 */