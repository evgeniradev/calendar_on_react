import React from 'react';

class DateElementsCreatorService {
  constructor(dispatch, dates, weekHeights) {
    this.dispatch = dispatch
    this.dates = dates;
    this.weekHeights = weekHeights
  }

  call() {
    const dateElementsRefs = {};

    const dateElements =
      this.dates.map((weekArray, weekIndex) => {
        return(
          <div
            className='calendar__week'
            style={{height: this.weekHeights[weekIndex + 1] || 100}}
            key={weekIndex}
          >
            {weekArray.map((dateObject, dateIndex) => {
              const fullDateAsString = dateObject.string
              const id = `calendar-date-${fullDateAsString}`
              const date = fullDateAsString.substring(0,2).replace(/^0/, '')
              const native = dateObject.native
              const ref = React.createRef();
              dateElementsRefs[fullDateAsString] = ref

              return(
                <div
                  ref={ref}
                  data-ms={dateObject.ms}
                  className={`calendar__date native-${native}`}
                  id={id} key={dateIndex}
                >
                  {date}
                </div>
              )
            })}
          </div>
        );
      });

    this.dispatch(
      {
        type: 'ADD_DATE_ELEMENTS_REFS',
        payload:
          {
            dateElementsRefs: dateElementsRefs
          }
      }
    );

    return dateElements;
  }
}

export default DateElementsCreatorService;
