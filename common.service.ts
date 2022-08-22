import { Injectable } from '@nestjs/common';
import * as _ from 'underscore';

@Injectable()
export class CommonService {
  inputParams: any;
  constructor() {}

  setParams(req: any) {
    this.inputParams = req;
  }

  getParams() {
    return this.inputParams;
  }
}
