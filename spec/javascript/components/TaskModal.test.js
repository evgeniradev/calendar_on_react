import React from 'react';
import TaskModal from '../../../app/javascript/components/TaskModal';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import { initialState } from '../../../app/javascript/store/reducer';

describe('<TaskModal />', () => {
  it('renders', () => {
    const mockStore = configureStore()
    const store = mockStore({taskModal: {...initialState.taskModal, showModal: true}});
    const wrapper = mount(<Provider store={store}><TaskModal /></Provider>);

    expect(wrapper).toMatchSnapshot();
  });
})
