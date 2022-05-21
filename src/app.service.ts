import { Injectable, HttpException } from '@nestjs/common';
import * as elasticsearch from 'elasticsearch';

@Injectable()
export class AppService {
    private readonly esclient: elasticsearch.Client;

    constructor() {
        this.esclient = new elasticsearch.Client({
            host: '', // replace with your cluster endpoint
        });
        this.esclient.ping({ requestTimeout: 3000 })
        .catch(err => { 
            throw new HttpException({
                status: 'error',
                message: 'Unable to reach Elasticsearch cluster'
             }, 500); 
         });
    }
    async bulkInsert(abilities: any[]) {
      const bulk = [];
      abilities.forEach(ability => {
          bulk.push({ 
              index: {_index: 'pokemons', _type: 'abilities'} 
          });
          bulk.push(ability);
      });
      return await this.esclient.bulk({
          body: bulk, 
          index: 'pokemons', 
          type: 'abilities'
      })
      .then(res => ({status: 'success', data: res}))
      .catch(err => { throw new HttpException(err, 500); });
  }

  // searches the 'pokemons' index for matching documents
  async searchIndex(q: string) {
      const body = {
          size: 200,
          from: 0,
          query: {
              match: {
                  name: q,
              },
          },
      };
      return await this.esclient.search({index: 'pokemons', body, q})
          .then(res => res.hits.hits)
          .catch(err => { throw new HttpException(err, 500); });
  }
  async deleteindex(q: string){
    const body = {
      query: {
        match : {
          name: q,
        },
      },
    };
    return this.esclient.deleteByQuery({ index: 'pokemons', body, q})
  }
  async updateindex(id: string, bodyObj: {name:string}, type: "abilities"){
      const body = {
          doc : bodyObj
      };
      console.log(JSON.stringify({index: 'pokemons', id, body, type }));
      
      return this.esclient.update({index: 'pokemons', id, body, type })
  }

}  