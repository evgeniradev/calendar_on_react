import React from 'react';
import Calendar from '../../../app/javascript/components/Calendar';
import { Provider } from 'react-redux';
import tasksJson from '../fixtures/tasksJson.json';
import store from '../../../app/javascript/store/store';
import waitForExpect from 'wait-for-expect';
import { mount } from 'enzyme';

describe('<Calendar />', () => {
  it('renders Calendar and tasks', async () => {
    const mockJsonPromise = Promise.resolve(tasksJson);
    const mockFetchPromise = Promise.resolve(
      {
        ok: true,
        json: () => mockJsonPromise,
      }
    );

    window.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

    const wrapper = mount(<Provider store={store}><Calendar /></Provider>);

    await waitForExpect(() => {
      expect(store.getState().taskElements).not.toEqual({});
    })

    wrapper.update();

    expect(wrapper).toMatchSnapshot();
  });
})
