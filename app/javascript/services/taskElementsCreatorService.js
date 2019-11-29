import React from 'react';
import { Rnd } from 'react-rnd';

import { flatten } from 'array-flatten';

import SharedMethodsService from './sharedMethodsService'

class TaskElementsCreatorService {
  constructor(
    dispatch,
    dateElementsRefs,
    tasksJson,
    hoveredTaskId,
    unhoveredTaskId,
    prevTaskElements
  ) {
    this.dispatch = dispatch;
    this.dateElementsRefs = dateElementsRefs;
    this.hoveredTaskId = hoveredTaskId;
    this.unhoveredTaskId = unhoveredTaskId;
    this.hoveredOrUnhoveredTaskId = this.hoveredTaskId || this.unhoveredTaskId;
    this.prevTaskElements = prevTaskElements;
    this.weeksTotalNumberOfTaskRows = {};
    this.weekHeights = [];
    this.taskElements = {};
    // pixels
    this.taskHeight = 30;
    // pixels
    this.minTaskWidth = 101;

    if (this.hoveredOrUnhoveredTaskId){
      this.tasksJson = [
        tasksJson.find(task => task.id === this.hoveredOrUnhoveredTaskId)
      ];
    } else {
      this.tasksJson = tasksJson;
    }
  }

  getDateAsUtcMs(dateString) {
    const dateStringYear = dateString.substring(6,11);
    const dateStringMonth = parseInt(dateString.substring(3,5) - 1);
    const dateStringDate = dateString.substring(0,2);

    return Date.UTC(...SharedMethodsService.getDateValues(dateString));
  }

  getTaskX(task) {
    return task.offsetLeft;
  }

  addTaskElement(task, weekNumber, taskWidth, taskX, taskY, borderRadiusClass) {
    const taskElement =
      this.createTaskElement(
        task,
        weekNumber,
        taskWidth,
        taskX,
        taskY,
        borderRadiusClass
      );

    this.taskElements[task.id].push(taskElement);
  }

  getTaskY = (
    dateElement,
    weekNumber,
    dateElementOwnWeekSiblingDates,
    dateElementIndexInOwnWeek
  ) => {
    const offsetTop = dateElement.offsetTop;
    const numberOfDaysInWeek = 7;

    if (this.weeksTotalNumberOfTaskRows[weekNumber] === undefined)
      this.weeksTotalNumberOfTaskRows[weekNumber] = 0;

    this.weeksTotalNumberOfTaskRows[weekNumber]++;

    return offsetTop
      + (this.weeksTotalNumberOfTaskRows[weekNumber] * this.taskHeight);
  }

  call() {
    const allDateElements = Object.values(this.dateElementsRefs);

    this.tasksJson.map((task) => {

      this.taskElements[task.id] = [];

      let taskStartElement = this.dateElementsRefs[task.startDate];
      let taskEndElement = this.dateElementsRefs[task.endDate];
      let taskStartDateOutOfReach = false;
      let taskEndDateOutOfReach = false;

      if (taskStartElement === undefined && taskEndElement === undefined) {
        const earliestVisibleDateAsUtcMs =
          allDateElements[0].current.dataset.ms;
        const latestVisibleDateAsUtcMs =
          allDateElements[allDateElements.length - 1].current.dataset.ms;
        const taskStartDateAsUtcMs = this.getDateAsUtcMs(task.startDate);
        const taskEndDateASUtcMS = this.getDateAsUtcMs(task.endDate);

        if (
          earliestVisibleDateAsUtcMs - taskStartDateAsUtcMs > 0
            && latestVisibleDateAsUtcMs - taskEndDateASUtcMS < 0
        ){
          taskStartDateOutOfReach = true;
          taskStartElement =
            this.dateElementsRefs[Object.keys(this.dateElementsRefs)[0]];
        }
      }

      if (taskStartElement !== undefined || taskEndElement !== undefined) {

        const allWeekElements =
          [
            ...(taskStartElement || taskEndElement)
              .current
              .parentElement
              .parentElement
              .children
          ];

        if (taskStartElement === undefined) {
          const firstVisibleWeekElement = [...allWeekElements[0].children];
          const firstDateElementInFirstVisibleWeekElement =
            firstVisibleWeekElement[0];
          taskStartDateOutOfReach = true;
          taskStartElement = firstDateElementInFirstVisibleWeekElement;
        } else {
          taskStartElement = taskStartElement.current;
        }

        if (taskEndElement === undefined) {
          const lastVisibleWeekElement =
            allWeekElements[allWeekElements.length - 1];
          const lastDateElementInLastVisibleWeekElement =
            lastVisibleWeekElement[lastVisibleWeekElement.length - 1];
          taskEndDateOutOfReach = true;
          taskEndElement = lastDateElementInLastVisibleWeekElement;
        } else {
          taskEndElement = taskEndElement.current;
        }

        const taskStartElementWeekElement = taskStartElement.parentElement;
        const taskStartElementOwnWeekSiblingDateElements =
          [...taskStartElementWeekElement.children];

        let tmpTaskElement = taskStartElement;
        let tmpTaskElementSiblings = taskStartElementOwnWeekSiblingDateElements;

        while (
          (tmpTaskElementSiblings instanceof Array)
            && tmpTaskElementSiblings.indexOf(taskEndElement) < 0
        ) {
          const tmpTaskElementX = this.getTaskX(tmpTaskElement);
          const tmpTaskElementOwnWeek = tmpTaskElement.parentElement;
          const tmpTaskElementWeekNumber =
            allWeekElements.indexOf(tmpTaskElementOwnWeek) + 1;
          const tmpTaskElementOwnWeekSiblingDates =
            [...tmpTaskElement.parentElement.children];
          const tmpTaskElementIndexInOwnWeek =
            tmpTaskElementOwnWeekSiblingDates.indexOf(tmpTaskElement);
          const numberOfDatesTmpTaskElementCrosses =
            7 - tmpTaskElementIndexInOwnWeek;
          const tmpTaskElementY =
            this.getTaskY(
              tmpTaskElement,
              tmpTaskElementWeekNumber,
              tmpTaskElementOwnWeekSiblingDates,
              tmpTaskElementIndexInOwnWeek
            );
          const tmpTaskWidth =
            this.minTaskWidth * numberOfDatesTmpTaskElementCrosses;
          const tmpTaskElementOwnWeekIndexInMonth =
            allWeekElements.indexOf(tmpTaskElementOwnWeek);
          const nextWeekElement =
            allWeekElements[tmpTaskElementOwnWeekIndexInMonth + 1];
          let borderRadiusClass = '';

          if (tmpTaskElement === taskStartElement && !taskStartDateOutOfReach) {
            borderRadiusClass = 'no-right-border-radius';
          } else {
            borderRadiusClass = 'no-border-radius';
          }

          this.addTaskElement(
            task,
            tmpTaskElementWeekNumber,
            tmpTaskWidth,
            tmpTaskElementX,
            tmpTaskElementY,
            borderRadiusClass
          );

          if (nextWeekElement === undefined)
            break;

          tmpTaskElementSiblings = [...nextWeekElement.children];
          tmpTaskElement = tmpTaskElementSiblings[0];
        }

        if (!taskEndDateOutOfReach) {
          let borderRadiusClass = '';
          let taskLastDateElement = null;
          let numberOfDatesLastTaskElementCrosses = null;

          if (
            tmpTaskElementSiblings === taskStartElementOwnWeekSiblingDateElements
          ) {
            taskLastDateElement = taskStartElement;
            numberOfDatesLastTaskElementCrosses =
              tmpTaskElementSiblings.indexOf(taskEndElement)
                - tmpTaskElementSiblings.indexOf(taskStartElement) + 1;
          } else {
            taskLastDateElement = tmpTaskElementSiblings[0];
            numberOfDatesLastTaskElementCrosses =
              tmpTaskElementSiblings.indexOf(taskEndElement) + 1;
            borderRadiusClass = 'no-left-border-radius';
          }

          const taskLastDateElementOwnWeek = taskLastDateElement.parentElement;
          const taskLastDateElementOwnWeekSiblingDates =
            [...taskLastDateElementOwnWeek.children];
          const taskLastDateElementWeekNumber =
            allWeekElements.indexOf(taskLastDateElementOwnWeek) + 1;
          const taskLastDateElementIndexInOwnWeek =
            taskLastDateElementOwnWeekSiblingDates.indexOf(taskLastDateElement);
          const taskLastDateElementX = this.getTaskX(taskLastDateElement);
          const taskLastDateElementY =
            this.getTaskY(
              taskLastDateElement,
              taskLastDateElementWeekNumber,
              taskLastDateElementOwnWeekSiblingDates,
              taskLastDateElementIndexInOwnWeek
            );
          const taskLastDateElementTaskWidth =
            this.minTaskWidth * numberOfDatesLastTaskElementCrosses;

          this.addTaskElement(
            task,
            taskLastDateElementWeekNumber,
            taskLastDateElementTaskWidth,
            taskLastDateElementX,
            taskLastDateElementY,
            borderRadiusClass
          );
        }
      }
    })

    this.offsetTasksYValues();
    this.setWeekHeights();

    const payload = {};

    if (this.hoveredOrUnhoveredTaskId) {
      const tmp = {...this.prevTaskElements};
      tmp[this.hoveredOrUnhoveredTaskId] =
        this.taskElements[this.hoveredOrUnhoveredTaskId];

      payload.taskElements = tmp;
    } else {
      payload.taskElements = this.taskElements;
      payload.weekHeights = this.weekHeights;
    }

    this.dispatch({type: 'ADD_TASK_ELEMENTS', payload: payload});
  }

  setWeekHeights() {
    const weekHeights = {};

    Object.keys(this.weeksTotalNumberOfTaskRows).forEach(weekNumber => {
      let height = null;

      if (
        this.weeksTotalNumberOfTaskRows[weekNumber]
          && this.weeksTotalNumberOfTaskRows[weekNumber] > 2
      ) {
        height =
          ((this.weeksTotalNumberOfTaskRows[weekNumber] || 1) * this.taskHeight)
            + this.taskHeight + 10;
      }

      weekHeights[weekNumber] = height;

    })

    this.weekHeights = weekHeights;
  }

  // Offsets the tasks' Y values by the weeks' heights
  offsetTasksYValues() {
    flatten(Object.values(this.taskElements)).map((task) => {
      let offset = 0;

      for (let i = 1; i < task.props.weeknumber; i++) {

        let height = null;

        const tmp = this.weeksTotalNumberOfTaskRows[i];

        if (!tmp || tmp < 3) {
          height = 0;
        } else {
          height = (tmp * this.taskHeight) - this.taskHeight * 2;
        }

        offset += height;
      }

      if (offset)
        task.props.default.y = task.props.default.y + offset;

    })
  }

  toggleHoverTaskElementGroupEffect(taskId, unhoveredTaskId) {
    this.dispatch(
      {
        type: 'TOGGLE_HOVER_EFFECT',
        payload:
          {
            hoveredTaskId: taskId,
            unhoveredTaskId: unhoveredTaskId
          }
      }
    );
  }

  handleEditTaskModal(task) {
    this.dispatch(
      {
        type: 'TASK_MODAL_OPEN_EDIT',
        payload: {
          task: task
        }
      }
    );
  }

  createTaskElement(
      task,
      weekNumber,
      taskWidth,
      taskX,
      taskY,
      borderRadiusClass
  ) {
    return(
      <Rnd
        className={`calendar__task-wrapper ${borderRadiusClass}`}
        disableDragging={true}
        resizeGrid={[this.minTaskWidth,2]}
        enableResizing={{}}
        minWidth={this.minTaskWidth}
        bounds='parent'
        weeknumber={weekNumber}
        onMouseOver={(e) => this.toggleHoverTaskElementGroupEffect(task.id)}
        onMouseOut={(e) => this.toggleHoverTaskElementGroupEffect(null, task.id)}
        default={{x: taskX, y: taskY, width: taskWidth, height: this.taskHeight}}
        onResizeStart={(e, direction, ref, delta, position) => {}}
        onResizeStop={(e, direction, ref, delta, position) => {}}
        key={`${weekNumber}-${task.id}`}
      >
        <div
          onClick={this.handleEditTaskModal.bind(this, task)}
          className=
            { `calendar__task ${
                borderRadiusClass
              } hovered-${
                this.hoveredTaskId == task.id
              }`
            }>
              <span className='calendar__task-name'>
                {`${task.name || ''} ${task.startDate} - ${task.endDate}`}
              </span>
        </div>
      </Rnd>
    );
  }
}

export default TaskElementsCreatorService;
