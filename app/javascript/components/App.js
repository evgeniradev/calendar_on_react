import React from 'react';
import Calendar from './Calendar';

import store from '../store/store';
import { Provider } from 'react-redux';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <Provider store={store}>
        <Calendar />
      </Provider>
    );
  }
}

export default App;
