import { Injectable } from '@nestjs/common';
import { isArray } from 'underscore';
@Injectable()
export class UserAgentService {
  mobiles = [
    'mobileexplorer',
    'palmsource',
    'palmscape',
    'motorola',
    'nokia',
    'palm',
    'iphone',
    'ipad',
    'ipod',
    'sony',
    'ericsson',
    'blackberry',
    'cocoon',
    'blazer',
    'lg',
    'amoi',
    'xda',
    'mda',
    'vario',
    'htc',
    'samsung',
    'sharp',
    'sie-',
    'alcatel',
    'benq',
    'ipaq',
    'mot-',
    'playstation portable',
    'playstation 3',
    'playstation vita',
    'hiptop',
    'nec-',
    'panasonic',
    'philips',
    'sagem',
    'sanyo',
    'spv',
    'zte',
    'sendo',
    'nintendo dsi',
    'nintendo ds',
    'nintendo 3ds',
    'wii',
    'open web',
    'openweb',
    'webos',
    'android',
    'symbian',
    'SymbianOS',
    'elaine',
    'series60',
    'windows ce',
    'obigo',
    'netfront',
    'openwave',
    'mobilexplorer',
    'operamini',
    'opera mini',
    'opera mobi',
    'fennec',
    'digital paths',
    'avantgo',
    'xiino',
    'novarra',
    'vodafone',
    'docomo',
    'o2',
    'mobile',
    'wireless',
    'j2me',
    'midp',
    'cldc',
    'up.link',
    'up.browser',
    'smartphone',
    'cellphone',
  ];
  robots = [
    'googlebot',
    'msnbot',
    'baiduspider',
    'bingbot',
    'slurp',
    'yahoo',
    'ask jeeves',
    'fastcrawler',
    'infoseek',
    'lycos',
    'yandex',
    'mediapartners-google',
    'CRAZYWEBCRAWLER',
    'adsbot-google',
    'feedfetcher-google',
    'curious george',
  ];
  constructor() {}

  is_robot(userAgent: string) {
    if (isArray(this.robots) && this.robots.length > 0) {
      return this.robots.some((robot) => {
        if (userAgent.toLowerCase().search(robot) != -1) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  }

  is_mobile(userAgent: string) {
    let is_tablet: any;
    if (isArray(this.mobiles) && this.mobiles.length > 0) {
      return this.mobiles.some((mobile) => {
        if (userAgent.toLowerCase().search(mobile) != -1) {
          if (this.is_tablet(userAgent) == 'tablet') {
            is_tablet = true;
          }
          return true;
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  }

  is_tablet(userAgent: string) {
    const iPhone = userAgent.toLowerCase().search('mobile');
    const android = userAgent.toLowerCase().search('android');
    const windowsPhone = userAgent.toLowerCase().search('phone');
    var androidTablet = false;
    if (userAgent.toLowerCase().search('android') != -1) {
      if (userAgent.toLowerCase().search('mobile') == -1) {
        androidTablet = true;
      }
    }
    const iPad = userAgent.toLowerCase().search('ipad');
    if (androidTablet || iPad != -1) {
      return 'tablet';
    } else if (
      (iPhone != -1 && iPad == -1) ||
      (android != -1 && !androidTablet) ||
      windowsPhone != -1
    ) {
      return 'mobile';
    } else {
      return 'desktop';
    }
  }

  _randomsharecode(ip: string) {
    const characters = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];
    var randstring = '';
    for (let i = 0; i < 18; i++) {
      const c = characters[Math.floor(Math.random() * characters.length)];
      randstring += c;
    }
    randstring =
      randstring + ip.replace(/\./g, '') + Math.floor(Date.now() / 1000);
    console.log(randstring);
    return randstring;
  }
}
