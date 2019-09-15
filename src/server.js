import { ApolloServer, gql } from 'apollo-server'
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date'

import { ContributorRepository } from './repository/contributors'
import { PersonalDataService } from './repository/personalData'

import { getLogger } from './debugger'

const debug = getLogger();

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  scalar Date
  scalar DateTime

  # Contributor
  type Contributor {
    id: ID!
    region: String!
    start: Date
    end: Date
    subcriptionDate: DateTime
    unscriptionDate: DateTime
    personalData: PersonalData
  }

  # Personal Data
  type PersonalData {
    title: String,
    firstName: String,
    lastName: String,
    nir: String,
    riba: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    contributors(region: String = "all"): [Contributor]
    contributor(id: String): Contributor
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Query: {
    //    contributors: (_source, {region}) => contributors.filter(contributor => region == "all" || contributor.region == region),
    contributors: async (_source, { region }, { dataSources }, _info) => dataSources.contributors.findContributors(region),
    contributor: async (_source, { id }, { dataSources }, _info) => dataSources.contributors.findContributor(id),
  },
  Contributor: {
    personalData(contributor, _, { dataSources }, _info) {
      return dataSources.personalDataService.getPersonalData(contributor.id);
    }
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      contributors: new ContributorRepository(),
      personalDataService: new PersonalDataService(),
    };
  }
});

debug('starting server..')

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
