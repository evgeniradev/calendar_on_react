import DatesCreatorService from '../../../app/javascript/services/datesCreatorService';
import datesCreatorServiceJson from '../fixtures/expectations/datesCreatorServiceJson.json';

describe('DatesService', () => {
  it('creates dates', () => {
    const datesCreatorService = new DatesCreatorService(2019, 1);

    expect(datesCreatorService.call()).toEqual(datesCreatorServiceJson);
  });
})
