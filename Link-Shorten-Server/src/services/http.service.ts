import { Injectable, Request } from '@nestjs/common';
const geoip = require('geoip-lite');
@Injectable()
export class HttpService {
  constructor() {}
  //#region Get client ip
  getClientIp(@Request() request: any) {
    const headers = request.headers;
    const clientIp =
      headers['true-client-ip'] ||
      headers['cf-connecting-ip'] ||
      headers['x-forwarded-for']?.split(',')[0] ||
      request.connection.remoteAddress;
    return clientIp;
  }
  //#endregion

  //#region Get location
  getLocationByIp(ip: string) {
    let data = geoip.lookup(ip);
    return data;
  }
  //#endregion

  //#region Get hostname of URL
  getHostname(url: string): string {
    return new URL(url).hostname;
  }
  //#endregion

  //#region Get favicon of url
  getFavicon(url: string): string {
    return 'https://icons.duckduckgo.com/ip3/' + this.getHostname(url) + '.ico';
  }
  //#endregion
}
