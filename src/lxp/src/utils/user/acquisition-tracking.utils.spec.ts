import { LocalStorageKeys } from '@ecdlink/core';
import {
  UNKNOWN_UTM,
  captureAcquisitionTracking,
  clearAcquisitionTracking,
  getAcquisitionTracking,
} from './acquisition-tracking.utils';

describe('acquisition-tracking.utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('captures utm values and the full landing url', () => {
    const href =
      'http://app.ecdconnect.co.za/?utm_source=fb&utm_medium=post&utm_campaign=campaign-name';

    captureAcquisitionTracking(href);

    expect(getAcquisitionTracking()).toEqual({
      acquisitionUrl: href,
      utmSource: 'fb',
      utmMedium: 'post',
      utmCampaign: 'campaign-name',
    });
  });

  test('parses utm params regardless of order and extra query values', () => {
    const href =
      'http://app.ecdconnect.co.za/?fbclid=abc&utm_campaign=spring&utm_source=fb&utm_medium=post';

    captureAcquisitionTracking(href);

    expect(getAcquisitionTracking()).toMatchObject({
      utmSource: 'fb',
      utmMedium: 'post',
      utmCampaign: 'spring',
    });
  });

  test('stores Unknown when the landing url has no utm params', () => {
    captureAcquisitionTracking('http://app.ecdconnect.co.za/');

    expect(getAcquisitionTracking()).toEqual({
      acquisitionUrl: 'http://app.ecdconnect.co.za/',
      utmSource: UNKNOWN_UTM,
      utmMedium: UNKNOWN_UTM,
      utmCampaign: UNKNOWN_UTM,
    });
  });

  test('does not overwrite a stored landing url with a later untagged page', () => {
    const landing =
      'http://app.ecdconnect.co.za/?utm_source=fb&utm_medium=post';
    captureAcquisitionTracking(landing);
    captureAcquisitionTracking('http://app.ecdconnect.co.za/login');

    expect(getAcquisitionTracking().acquisitionUrl).toEqual(landing);
    expect(getAcquisitionTracking().utmSource).toEqual('fb');
  });

  test('upgrades an Unknown first visit when a later url has utm params', () => {
    captureAcquisitionTracking('http://app.ecdconnect.co.za/');
    const campaignUrl =
      'http://app.ecdconnect.co.za/?utm_source=fb&utm_medium=post&utm_campaign=later';
    captureAcquisitionTracking(campaignUrl);

    expect(getAcquisitionTracking()).toEqual({
      acquisitionUrl: campaignUrl,
      utmSource: 'fb',
      utmMedium: 'post',
      utmCampaign: 'later',
    });
  });

  test('keeps the first real utm and does not overwrite with a later campaign', () => {
    const first =
      'http://app.ecdconnect.co.za/?utm_source=fb&utm_medium=post&utm_campaign=first';
    captureAcquisitionTracking(first);
    captureAcquisitionTracking(
      'http://app.ecdconnect.co.za/?utm_source=ig&utm_medium=story&utm_campaign=second'
    );

    expect(getAcquisitionTracking()).toEqual({
      acquisitionUrl: first,
      utmSource: 'fb',
      utmMedium: 'post',
      utmCampaign: 'first',
    });
  });

  test('returns Unknown values when nothing has been captured', () => {
    expect(getAcquisitionTracking()).toEqual({
      acquisitionUrl: undefined,
      utmSource: UNKNOWN_UTM,
      utmMedium: UNKNOWN_UTM,
      utmCampaign: UNKNOWN_UTM,
    });
  });

  test('clears stored tracking after registration', () => {
    captureAcquisitionTracking(
      'http://app.ecdconnect.co.za/?utm_source=fb&utm_medium=post'
    );
    clearAcquisitionTracking();

    expect(
      localStorage.getItem(LocalStorageKeys.acquisitionTracking)
    ).toBeNull();
    expect(getAcquisitionTracking().utmSource).toEqual(UNKNOWN_UTM);
  });
});
