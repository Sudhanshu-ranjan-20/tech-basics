export const typeDefs = `#graphql
    type User{
        name:String
        address:String
    }
    type Query{
        allUsers:[User!]!
    }
`;
