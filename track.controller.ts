import {
  Controller,
  Get,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ok } from 'assert';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from 'src/guards/auth.guard';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}
  @Get()
  //@Redirect('https://www.purplle.com', 302)
  @UseGuards(AuthGuard)

  //method call
  public getTrack(
    @Query() trackk,
    @Res({ passthrough: true }) response: FastifyReply,
  ): any {
    return this.trackService.getTrack(trackk, response);
  }
}
