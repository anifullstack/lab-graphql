const graphql = require('graphql');
const _ = require('lodash');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;


const users = [
    { id: '23', firstName: 'Bill', age: '23' },
    { id: '25', firstName: 'Mary', age: '25' },

];

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:8081/companies/${parentValue.id}/users`).then(resp => resp.data);
            }

        }
    })
});


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                console.log("Schema", "parentValue", parentValue, args);
                return axios.get(`http://localhost:8081/companies/${parentValue.companyId}`).then(resp => resp.data);
            }
        }

    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:8081/users/${args.id}`).then(resp => resp.data);
            }
        },

        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:8081/companies/${args.id}`).then(resp => resp.data);

            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }

            },
            resolve(parentValue, { firstName, age }) {
                return axios.post(`http://localhost:8081/users`, { firstName, age }).then(resp => resp.data);
            }
        },

        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { id }) {
                console.log("Schema", "deleteUser", "parentValue", parentValue, id);
                return axios.delete(`http://localhost:8081/users/${id}`)
                    .then(res => {
                        console.log("Schema", "deleteUser", "res", res);
                        return res.data
                    });
            }
        },

        updateUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve(parentValue, args) {
                console.log("Schema", "updateUser", "params", args);
                return axios.patch(`http://localhost:8081/users/${args.id}`, args).then(res => res.data);
            }

        }
    }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation });
