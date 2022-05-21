import { Controller, Post, Body, Get, Query, Delete, Put, Param } from '@nestjs/common';
import { type } from 'os';
import { AppService } from './app.service';

@Controller('pokemon')
export class AppController {
    constructor(
        private readonly appService: AppService,
    ) {}

    @Post('create')
    async createIndexAndInsert(@Body() documents: any[]) {
        return await this.appService.bulkInsert(documents);
    }

    @Get('search')
    async searchPokemonAbilities(@Query('q') q: string) {
        const results = await this.appService.searchIndex(q);
        return results;
    }
    @Delete('delete')
   async deleteAbilities(@Query('q') q: string){
     return await this.appService.deleteindex(q);
   }
   @Put('update/:id')
   async updatenames(
       @Param('id') id:string,
       @Body('name') name:string
    ){
        console.log(name);
        
        const bodyObj = {
            name
        }
    return await await this.appService.updateindex(id, bodyObj, "abilities");
  }
}