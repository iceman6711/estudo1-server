import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

//teste ok
@Injectable()
export class MiscService { 

    constructor(private readonly config: ConfigService) {


    }

}
