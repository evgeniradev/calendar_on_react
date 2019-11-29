import TaskJsonFetcherService from '../../../app/javascript/services/taskJsonFetcherService';
import tasksJson from '../fixtures/tasksJson.json';

import configureStore from 'redux-mock-store'

describe('TaskJsonFetcherService', () => {
  let store = null;
  const mockStore = configureStore();

  describe('success', () => {
    const mockJsonPromise = Promise.resolve(tasksJson);
    const mockFetchPromise = Promise.resolve(
      {
        ok: true,
        json: () => mockJsonPromise,
      }
    );

    beforeEach(async () =>  {
      store = mockStore({});

      window.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

      await new TaskJsonFetcherService(store.dispatch, 2019, 11).call();
    })

    it('dispatches ADD_TASK_ELEMENTS action', () => {
      expect(store.getActions()[0].type).toBe('SET_TASK_JSON_DATA');
    });

    it("dispatched payload contains tasks' JSON", () => {
      expect(store.getActions()[0].payload.tasksJson).toEqual(tasksJson);
    });

    it('dispatched payload contains year', () => {
      expect(store.getActions()[0].payload.year).toEqual(2019);
    });

    it('dispatched payload contains month', () => {
      expect(store.getActions()[0].payload.month).toEqual(11);
    });
  })

  describe('failure', () => {
    const mockFetchPromise = Promise.resolve({ok: false});

    beforeEach(async () =>  {
      store = mockStore({});

      window.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

      window.alert = jest.fn().mockImplementation(() => true);

      await new TaskJsonFetcherService(store.dispatch, 2019, 11).call();
    })

    it('triggers alert', () => {
      expect(window.alert).toHaveBeenCalledTimes(1);
    });

    it('dispatches ADD_TASK_ELEMENTS action', () => {
      expect(store.getActions()[0].type).toBe('SET_TASK_JSON_DATA');
    });

    it("dispatched payload contains empty tasks' JSON", () => {
      expect(store.getActions()[0].payload.tasksJson).toEqual([]);
    });
  })
})
