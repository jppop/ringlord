import { ApolloServer, gql } from 'apollo-server'
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date'

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  scalar Date
  scalar DateTime

  # Contributor
  type Contributor {
    id: ID
    region: String
    start: Date
    end: Date
    subcriptionDate: DateTime
    unscriptionDate: DateTime
  }
  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    contributors(region: String = "all"): [Contributor]
  }
`;

const contributors = [
  {
    region: "999",
    id: "99900000000000002",
    start: "2019-05-01",
    end: "2019-04-17",
    subcriptionDate: "2019-04-16T23:00:00Z",
    unscriptionDate: "2019-04-17T08:11:42Z"
  },
  {
    region: "999",
    id: "99900000000000002",
    start: "2019-05-01",
    subcriptionDate: "2019-04-22T23:00:00Z",
  },
  {
    region: "998",
    id: "99800000000000001",
    start: "2019-05-01",
    subcriptionDate: "2019-04-22T23:00:00Z",
  }
]

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Query: {
    contributors: (obj, args, context, info) => contributors.filter(contributor => args.region == "all" || contributor.region == args.region),
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
