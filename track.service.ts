import { Get, Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { QueryTypes } from 'sequelize';
import { RedisCacheService } from '../redis/redis.service';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { UserAgentService } from 'src/shared/user-agent/user-agent.service';
import { GrpcService } from '../../src/shared/grpc/grpc.service';
@Injectable()
export class TrackService {
  constructor(
    @Inject('SEQUELIZE') private readonly sequelizeInstance,
    private readonly redisCacheService: RedisCacheService,
    private useragentService: UserAgentService,
    private grpcOption: GrpcService,
    @Inject(REQUEST) private request: FastifyRequest,
  ) {}

  async getTrack(Track: any, response: any) {
    //---------- Validation Check-----------
    let email: any;

    if (typeof Track.email === 'undefined') {
      email = 'null';
    } else {
      email = Track.email;
    }

    let campaign_name = Track.campaign;
    let dpl = Track.dpl;
    let tempgclid = Track.gclid;
    let tt = Track.tt;
    let tf = Track.tf;
    let placement = Track.placement;
    let secondary_publisher = Track.secondary_publisher;
    let inventory_type = Track.inventory_type;
    let attr_1 = Track.attr_1;
    let attr_2 = Track.attr_2;
    let attr_3 = Track.attr_3;
    let attr_4 = Track.attr_4;
    let pclid = Track.pclid ? Track.pclid : '';

    let gclid = typeof tempgclid !== 'undefined' ? tempgclid : 'null';
    let gclid_param =
      typeof tempgclid !== 'undefined' ? '&gclid=' + tempgclid : '';
    let temptrackid = Track.track_id;
    let trackid = typeof temptrackid !== 'undefined' ? temptrackid : 0;
    let cmp_name = campaign_name.split('_');
    //label adding
    let label = cmp_name[0];
    cmp_name.shift();
    let searchcampaign_name = cmp_name.join('_');
    let redirect_url = decodeURIComponent(Track.redirect);
    let campaign_data: any;

    //-----------Fetch data from Redis and Myql ---------
    const cachedResult: any = await this.redisCacheService.get(campaign_name);
    if (cachedResult !== null) {
      console.log('fetched from Redis');
      campaign_data = cachedResult;
    } else {
      console.log('fetched from DB');
      campaign_data = await this.sequelizeInstance.query(
        `SELECT c.*, sm.source, sm.medium, sm.is_paid FROM campaign c JOIN source_medium sm ON c.source_id = sm.id WHERE c.campaign_name = :searchcampaign_name AND c.label = :label`,
        {
          type: QueryTypes.SELECT,
          plain: true,
          replacements: {
            searchcampaign_name: searchcampaign_name,
            label: label,
          },
        },
      );

      // if (campaign_data === null) {
      //   campaign_data = 'No data found in DB';
      // }
      this.redisCacheService.set(campaign_name, campaign_data, 9000);
    }
    //campaign_data = null;
    //console.log(redirect_url);
    if (campaign_data === null) {
      //need to check
      console.log('No Data FOund');
      return { url: redirect_url };
    }

    //--------Check is_robot---------//

    let data: any = {};
    let robot = this.useragentService.is_robot(
      this.request.headers['user-agent'],
    );
    //console.log(robot);
    if ((dpl == 1 || dpl == 2) && !robot) {
      //console.log(redirect_url.indexOf('https://bnc.lt/a/'));
      if (redirect_url.indexOf('https://bnc.lt/a/') === -1) {
        data['url'] = redirect_url;
        data['dpl'] = dpl;
        data['campaign'] = campaign_data !== null ? campaign_data : false;
        data['campaign']['secondary_publisher'] = secondary_publisher;
        data['campaign']['attr_1'] = attr_1;
        data['campaign']['attr_2'] = attr_2;
        data['campaign']['attr_3'] = attr_3;
        data['campaign']['attr_4'] = attr_4;

        //Check if inventory type is provided in url parameters. If yes then override database value.
        if (inventory_type !== null) {
          data['campaign']['inventory_type'] = inventory_type;
        }

        redirect_url = await this.grpcOption.deeplink(data);
        console.log(redirect_url);
        //$redirect_url = json_decode($redirect_url);
        redirect_url = decodeURIComponent(redirect_url);
      }
    }

    //----------Cookies Section -----------//

    //let tempuser = await this.redisCacheService.userdata('user_id');
    let tempuser = '';
    let tempuseragent = this.request.headers['user-agent'];
    let user_id = tempuser != '' ? tempuser : 'null';
    let user_agent = tempuseragent != '' ? tempuseragent : 'null';
    let version_cookie: any;

    // if (typeof this.request.headers.cookie['siteversion'] !== 'undefined') {
    //   version_cookie = this.request.headers.cookie['siteversion'];
    // } else
    if (this.useragentService.is_mobile(this.request.headers['user-agent']))
      version_cookie = 'mobile';
    else version_cookie = 'desktop';
    version_cookie = 'desktop';
    //let cookie_val = this.request.cookies['visitorppl'];
    let cookie_val = '';
    if (!cookie_val) {
      cookie_val = await this.create_visitorppl(this.request.ip, response);
    }
    //console.log(this.request.headers.cookie);

    //---------Cookies Section End--------------//

    let utm_content = Track.utm_content;
    let redirect: any;
    if (redirect_url.indexOf('?') === -1) {
      redirect =
        redirect_url +
        '&utm_source=' +
        campaign_data['source'] +
        '&utm_medium=' +
        campaign_data['medium'] +
        '&utm_campaign=' +
        campaign_data['label'] +
        '_' +
        campaign_data['campaign_name'] +
        '&visitorppl=' +
        cookie_val +
        '' +
        gclid_param;
    } else {
      redirect =
        redirect_url +
        '?utm_source=' +
        campaign_data['source'] +
        '&utm_medium=' +
        campaign_data['medium'] +
        '&utm_campaign=' +
        campaign_data['label'] +
        '_' +
        campaign_data['campaign_name'] +
        '&visitorppl=' +
        cookie_val +
        '' +
        gclid_param;
    }

    if (typeof utm_content !== 'undefined') {
      redirect = redirect + '&utm_content=' + utm_content;
    }

    if (typeof campaign_data['inventory_type'] !== 'undefined') {
      redirect =
        redirect + '&inventory_type=' + campaign_data['inventory_type'];
    }

    if (typeof campaign_data['tag'] !== 'undefined') {
      redirect = redirect + '&tag=' + campaign_data['tag'];
    }

    if (typeof secondary_publisher !== 'undefined') {
      redirect = redirect + '&secondary_publisher=' + secondary_publisher;
    }

    if (trackid) {
      redirect = redirect + '&track_id=' + trackid;
    }

    if (typeof tt !== 'undefined') {
      redirect = redirect + '&tt=' + tt;
    }

    if (typeof tf !== 'undefined') {
      redirect = redirect + '&tf=' + tf;
    }

    if (typeof placement !== 'undefined') {
      redirect = redirect + '&placement=' + placement;
    }

    // purplle click id
    if (typeof pclid !== 'undefined') {
      redirect = redirect + '&pclid=' + pclid;
    }

    let send_type = 'email';
    if (campaign_data['source'].toLowerCase() == 'sms') {
      send_type = 'sms';
    }

    //--------- Send to pubsub------------
    let event_array: any = {};
    let session_array: any = {};

    event_array['event'] = 'campaign_click';

    event_array['event_type'] = 'setEvent';
    event_array['target_entity_id'] = decodeURIComponent(redirect);
    event_array['user_id'] = typeof user_id === 'undefined' ? '' : user_id;
    event_array['send_type'] = send_type;
    event_array['target_send_type'] = typeof email === 'undefined' ? '' : email;
    event_array['event_source'] =
      typeof campaign_data['source'] === 'undefined'
        ? ''
        : campaign_data['source'];
    event_array['event_medium'] =
      typeof campaign_data['medium'] === 'undefined'
        ? ''
        : campaign_data['medium'];
    event_array['event_campaign'] =
      campaign_data['label'] + '_' + campaign_data['campaign_name'];
    event_array['is_paid'] =
      typeof campaign_data['is_paid'] === 'undefined'
        ? '0'
        : campaign_data['is_paid'];
    event_array['gclid'] = typeof gclid === 'undefined' ? '' : gclid;
    event_array['event_content'] =
      typeof utm_content === 'undefined' ? '' : utm_content;
    event_array['x_id'] = '';
    event_array['secondary_publisher'] =
      typeof secondary_publisher === 'undefined' ? '' : secondary_publisher;
    event_array['inventory_type'] =
      typeof campaign_data['inventory_type'] === 'undefined'
        ? ''
        : campaign_data['inventory_type'];
    event_array['tag'] =
      typeof campaign_data['tag'] === 'undefined' ? '' : campaign_data['tag'];
    event_array['pclid'] = pclid === 'undefined' ? '' : pclid;

    session_array['mode_device'] =
      typeof version_cookie === 'undefined'
        ? ''
        : version_cookie.charAt(0).toUpperCase() + version_cookie.slice(1);
    session_array['version'] = '';
    session_array['build_number'] = '';
    session_array['user_agent'] =
      typeof user_agent === 'undefined' ? '' : user_agent;
    session_array['identifier'] =
      typeof cookie_val == 'undefined' ? '' : cookie_val;
    session_array['device_brand'] = '';
    session_array['device_model'] = '';
    session_array['os_version'] = '';
    session_array['session_id'] = '';
    session_array['event_time'] = Math.floor(Date.now() / 1000);
    session_array['user_id'] =
      typeof cookie_val == 'undefined' ? '' : cookie_val;
    session_array['entity_type'] = 'user';
    session_array['is_logged_in'] = 0;
    session_array['cart_count'] = 0;
    session_array['is_elite'] = 0;

    let return_event_array = {};
    return_event_array['event_data'] = event_array;
    return_event_array['session_data'] = session_array;

    let pubsub_event = JSON.parse(JSON.stringify(return_event_array));

    //console.log(pubsub_event);

    let pubsub_data: Array<any> = [];
    pubsub_data['data'] = pubsub_event;
    //console.log(pubsub_data);

    // let pubsub_response = this.pubSubService.publishToPubSub(
    //   pubsub_data,
    //   'gcp_event_topic',
    // );
  }
  async create_visitorppl(IP: string, response: any) {
    //console.log(response);
    let random_cookie = this.useragentService._randomsharecode(IP);
    let cookie = [];
    (cookie['name'] = 'visitorppll'),
      (cookie['value'] = random_cookie),
      //need to check
      (cookie['domain'] = 'localhost'),
      (cookie['path'] = '/'),
      (cookie['expire'] = 20 * 365 * 24 * 60 * 60),
      (cookie['prefix'] = ''),
      (cookie['secure'] = false),
      //need to set cookie
      //this.response.setCookie(cookie);
      response.setCookie(
        cookie['name'],
        cookie['value'],
        cookie['domain'],
        cookie['path'],
        cookie['expire'],
        cookie['secure'],
      );
    //console.log(cookie);
    return random_cookie;
  }
  async get_deeplink(data: any) {
    console.log(data);
    //later we will define this function
    return 'https://localhost';
  }
}
