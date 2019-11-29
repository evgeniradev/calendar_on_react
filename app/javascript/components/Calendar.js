import '../styles/calendar.scss'

import React from 'react';
import PropTypes from 'prop-types';
import TaskModal from './TaskModal';

import DatesCreatorService from '../services/datesCreatorService';
import TaskElementsCreatorService from '../services/taskElementsCreatorService';
import TaskJsonFetcherService from '../services/taskJsonFetcherService';
import DateElementsCreatorService from '../services/dateElementsCreatorService';

import { flatten } from 'array-flatten';

import store from '../store/store';
import { connect } from 'react-redux';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
  }

  changeMonth(action) {
    let month = this.props.month + action;
    let year = this.props.year;

    if (month > 12) {
      month = 1;
      year = this.props.year + 1;
    } else if (month < 1) {
      month = 12;
      year = this.props.year - 1;
    }

   new TaskJsonFetcherService(store.dispatch, year, month).call();
  }

  componentDidMount() {
    new TaskJsonFetcherService(
      store.dispatch,
      this.props.year,
      this.props.month
    ).call();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const hoveredTaskIdChanged =
      prevProps.hoveredTaskId !== this.props.hoveredTaskId;
    const tasksJsonChanged =
      prevProps.tasksJson !== this.props.tasksJson;

    if (hoveredTaskIdChanged || tasksJsonChanged)
      new TaskElementsCreatorService(
        store.dispatch,
        store.getState().dateElementsRefs,
        this.props.tasksJson,
        this.props.hoveredTaskId,
        this.props.unhoveredTaskId,
        this.props.taskElements
      ).call();
  }
  render() {
    return (
      <div className='calendar'>
        <div className='calendar__tasks'>
          { flatten(Object.values(this.props.taskElements)).map(task => task) }
        </div>
        <h3
          id='calendar__month-and-year'
        >
          Year: {this.props.year} Month: {this.props.month}
        </h3>
        <div className='calendar__operations'>
          <div className='calendar__month-changers'>
            <button
              id='calendar__month-back'
              onClick={this.changeMonth.bind(this, -1)}
            >
              Back
            </button>
            <button
              id='calendar__month-forth'
              onClick={this.changeMonth.bind(this, 1)}
            >
              Forth
            </button>
          </div>
          <TaskModal />
        </div>
        <div className='calendar__week calendar__weekday-names'>
          <div className='calendar__date'>
            Monday
          </div>
          <div className='calendar__date'>
            Tuesday
          </div>
          <div className='calendar__date'>
            Wednesday
          </div>
          <div className='calendar__date'>
            Thursday
          </div>
          <div className='calendar__date'>
            Friday
          </div>
          <div className='calendar__date'>
            Saturday
          </div>
          <div className='calendar__date'>
            Sunday
          </div>
        </div>
        <div className='calendar__dates'>
          { new DateElementsCreatorService(
              store.dispatch,
              new DatesCreatorService(this.props.year, this.props.month).call(),
              this.props.weekHeights
            ).call()
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    taskElements: state.taskElements,
    year: state.year,
    month: state.month,
    hoveredTaskId: state.hoveredTaskId,
    tasksJson: state.tasksJson,
    weekHeights: state.weekHeights
  };
}

export default connect(mapStateToProps)(Calendar);
