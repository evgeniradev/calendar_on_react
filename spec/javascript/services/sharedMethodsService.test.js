import SharedMethodsService from '../../../app/javascript/services/sharedMethodsService';

describe('SharedMethodsService', () => {
  it('creates dates', () => {
    const result =
      JSON.stringify(
        new Date(...SharedMethodsService.getDateValues('22-12-2018'))
      );

    expect(result).toEqual("\"2018-12-22T00:00:00.000Z\"");
  });
})
