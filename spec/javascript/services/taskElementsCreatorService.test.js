import TaskElementsCreatorService from '../../../app/javascript/services/taskElementsCreatorService';
import configureStore from 'redux-mock-store'

describe('TaskElementsCreatorService', () => {
  let store = null;
  const mockStore = configureStore();

  beforeEach(() => {
    store = mockStore({});

    const tasksJson = JSON.parse(
      '[{"id":1,"name":"Task","startDate":"27-10-2019","endDate":"09-12-2019"}]'
    );

    const dateElementsRefs = [
      {
        current: {
          dataset: {
            ms: 1
          }
        }
      }
    ];

    new TaskElementsCreatorService(
      store.dispatch,
      dateElementsRefs,
      tasksJson
    ).call()
  });


  it('dispatches ADD_TASK_ELEMENTS action', () => {
    expect(store.getActions()[0].type).toBe('ADD_TASK_ELEMENTS');
  });

  it('dispatched payload contains taskElements', () => {
    expect(
      Object.keys(store.getActions()[0].payload.taskElements)
    ).toEqual(['1']);
  });
})
