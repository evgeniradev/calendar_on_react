import DateElementsCreatorService from '../../../app/javascript/services/dateElementsCreatorService';
import DatesCreatorService from '../../../app/javascript/services/datesCreatorService';
import dateElementsCreatorServiceJson from '../fixtures/expectations/dateElementsCreatorServiceJson.json';
import { renderToString } from 'react-dom/server';

describe('DateElementsCreatorService', () => {
  it('creates html elements', () => {
    const dates = new DatesCreatorService(2019, 1).call();
    const result = new DateElementsCreatorService(function(){}, dates, {}).call();

    expect(renderToString(result)).toEqual(dateElementsCreatorServiceJson.html);
  });
})
