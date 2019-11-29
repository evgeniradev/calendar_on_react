import 'react-datepicker/dist/react-datepicker.css';

import React from 'react';
import Modal from 'react-modal';
import DatePicker, { registerLocale } from 'react-datepicker';

import en from 'date-fns/locale/en-GB';
import { connect } from "react-redux";

registerLocale('en', en);

Modal.setAppElement('body')

class TaskModal extends React.Component {
  constructor (props) {
    super(props);

    this.datePickerDateFormat = 'dd/M/yyyy';
  }

  handleSubmit(event) {
    const id = this.props.formData.id;
    const method = id ? 'PUT' : 'POST';

    fetch(`/tasks/${id ? id : ''}`, {
      method: method,
      headers:
        {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
        },
      body: JSON.stringify(this.props.formData)})
    .then(response =>  {
       if (!response.ok)
            throw Error(response.statusText);

        alert(`Task ${id ? 'updated' : 'added'} successfully!`)
        location.reload()
     })
    .catch((error) => {
      alert('Error')
    });

    event.preventDefault();
  }

  render () {
    return (
      <div className='calendar__task-modal'>
        <button
          className='calendar__add-task-btn'
          onClick={this.props.handleOpenModal}
        >
          Add Task
        </button>
        <Modal
           isOpen={this.props.showModal}
           contentLabel='Minimal Modal Example'
        >
        <form
          onSubmit={this.handleSubmit.bind(this)}
          className='calendar__modal-form'
        >
          <div className='calendar__modal-form-group'>
            <label>Name:</label>
            <input
              type='text'
              id='calendar__modal-form-name'
              onChange={(e) => this.props.handleFieldChange(e, 'name')}
              value={this.props.formData.name}
            />
          </div>
          <div className='calendar__modal-form-group'>
            <label>Start Date:</label>
            <DatePicker
              locale='en'
              selectsStart
              startDate={this.props.datePickerData.startDate}
              dateFormat={this.datePickerDateFormat}
              selected={this.props.datePickerData.startDate}
              onChange={(d) => this.props.handleDateChange(d, 'startDate')}
            />
          </div>
          <div className='calendar__modal-form-group'>
            <label>End Date:</label>
            <DatePicker
              locale='en'
              selectsEnd
              endDate={this.props.datePickerData.endDate}
              minDate={this.props.datePickerData.startDate}
              dateFormat={this.datePickerDateFormat}
              selected={this.props.datePickerData.endDate}
              onChange={(d) => this.props.handleDateChange(d, 'endDate')}
            />
          </div>
          <input type='submit' id='calendar__modal-submit' value='Submit'/>
          <button onClick={this.props.handleCloseModal}>Close Modal</button>
        </form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showModal: state.taskModal.showModal,
    formData: state.taskModal.formData,
    datePickerData: state.taskModal.datePickerData
  };
}

const mapDispatchToProps = dispatch => {
  return {
    handleOpenModal: () => dispatch(
      {
        type: 'TASK_MODAL_OPEN_NEW',
        payload:
          {
            showModal: true
          }
      }
    ),
    handleCloseModal: () => dispatch(
      {
        type: 'TASK_MODAL_CLOSE',
        payload:
          {
            showModal: false
          }
      }
    ),
    handleFieldChange: (event, key) => dispatch(
      {
        type: 'TASK_MODAL_FIELD_CHANGE',
        payload:
          {
            key: key,
            value: event.target.value
          }
      }
    ),
    handleDateChange: (date, key) => dispatch(
      {
        type: 'TASK_MODAL_DATE_CHANGE',
        payload:
          {
            key: key,
            date: date
          }
      }
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskModal);
