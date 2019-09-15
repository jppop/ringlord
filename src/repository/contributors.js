import Knex from "knex";
import { SQLDataSource } from 'datasource-sql';

const knex = Knex({
  client: 'pg',
  connection: process.env.DATASOURCE,
});

const limit = 25;

export class ContributorRepository extends SQLDataSource {

  constructor() {
    super();
    this.db = knex;
  }

  findContributors(region) {
    var query = this.db.withSchema('pgmodrev')
      .select(
        { region: 'code_ur' },
        { id: 'contributor_id' },
        'start', 'end',
        {subcriptionDate: 'subscribtion_date'}, {unscriptionDate: 'unsubscribtion_date'})
      .from('contributor')
      if (region != 'all') {
        query = query.where({code_ur: region});
      }
      return query.limit(limit);
  }

  findContributor(id) {
    var query = this.db.withSchema('pgmodrev')
      .first(
        { region: 'code_ur' },
        { id: 'contributor_id' },
        'start', 'end',
        {subcriptionDate: 'subscribtion_date'}, {unscriptionDate: 'unsubscribtion_date'})
      .from('contributor')
      .where({contributor_id: id});
      return query;
  }
}


