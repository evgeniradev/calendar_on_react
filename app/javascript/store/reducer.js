import SharedMethodsService from '../services/sharedMethodsService';

const initialState = {
  taskModal: {
    showModal: false,
    formData: {
      task_id: null,
      name: '',
      start_date: null,
      end_date: null
    },
    datePickerData:
      {
        startDate: null,
        endDate: null}
      },
    taskElements: {},
    year: 2019,
    month: 11,
    hoveredTaskId: null,
    unhoveredTaskId: null,
    tasksJson: [],
    weekHeights: {},
    dateElementsRefs: {}
  }

const reducer = (state = initialState, action) => {
  let tmp = null;

  switch(action.type) {
    case 'ADD_DATE_ELEMENTS_REFS':
      return  Object.assign({}, state, action.payload);
      break;
    case 'ADD_TASK_ELEMENTS':
      return  Object.assign({}, state, action.payload);
      break;
    case 'SET_TASK_JSON_DATA':
      return Object.assign(
        {},
        state,
        action.payload,
        {
          taskElements: {},
          weekHeights: {},
          hoveredTaskId: null,
          unhoveredTaskId: null
        }
      );
      break;
    case 'TASK_MODAL_CLOSE':
      return {...state, taskModal: initialState.taskModal};
      break;
    case 'TASK_MODAL_DATE_CHANGE':
      const formDataDateChange = {...state.taskModal.formData};
      const datePickerData = {...state.taskModal.datePickerData};
      const year = action.payload.date.getFullYear();
      const month = action.payload.date.getMonth() + 1;
      const date = action.payload.date.getDate();
      const dateString = `${date}-${month}-${year}`;

      formDataDateChange[action.payload.key.replace('Date', '_date')] = dateString;
      datePickerData[action.payload.key] = action.payload.date;

      return {
        ...state,
        taskModal:
          {
            ...state.taskModal,
            datePickerData: datePickerData,
            formData: formDataDateChange
          }
      };
      break;
    case 'TASK_MODAL_FIELD_CHANGE':
      const formDataFieldChange = {...state.taskModal.formData};
      formDataFieldChange[action.payload.key] = action.payload.value;

      return {
        ...state,
        taskModal:
          {
            ...state.taskModal,
            formData: formDataFieldChange
          }
      };
      break;
    case 'TOGGLE_HOVER_EFFECT':
      return  Object.assign({}, state, action.payload);
      break;
    case 'TASK_MODAL_OPEN_EDIT':
      const startDateObj = new Date(
        ...SharedMethodsService.getDateValues(action.payload.task.startDate)
      );
      const endDateObj = new Date(
        ...SharedMethodsService.getDateValues(action.payload.task.endDate)
      );

      return  {
        ...state,
        taskModal:
          Object.assign(
            {},
            state.taskModal,
            { showModal: true },
            { datePickerData:
              { startDate: startDateObj,
                endDate: endDateObj
              }
            },
            { formData:
              { id: action.payload.task.id,
                name: action.payload.task.name || '',
                start_date: action.payload.task.startDate,
                end_date: action.payload.task.endDate
              }
            }
          )
        };
      break;
    case 'TASK_MODAL_OPEN_NEW':
      return  {...state, taskModal: {...state.taskModal, showModal: true}};
      break;
    default:
      return state;
  }
};

export {reducer as default, initialState as initialState};
