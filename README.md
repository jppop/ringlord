# GraphQL POC

GraphQL application based on [Apollo Server](https://www.apollographql.com/docs/apollo-server/).

Key points:
- Database (PostgreSQL) source using [datasource-sql](https://www.npmjs.com/package/datasource-sql) with Knex as ORM
- Custom SOAP data sources (using [soap](https://www.npmjs.com/package/soap) module)
  A resolver fetches data from 2 services then combines the results

TODO
- [ ] caching, batch loading
- [ ] Move back to Java.
