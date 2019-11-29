class TaskJsonFetcherService {
  constructor(dispatch, year, month) {
    this.dispatch = dispatch;
    this.year = year
    this.month = month
  }

  call() {
    fetch(
      '/calendar/tasks',
      {
        method: 'POST',
        headers:
          {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
          },
        body: `{"year": ${this.year}, "month": ${this.month}}`
      }
    )
    .then((response) => {
      if (!response.ok)
        throw Error(response.statusText);

      return response.json()
    })
    .then((tasksJson) => {
      this.dispatch(
        {
          type: 'SET_TASK_JSON_DATA',
          payload:
            {
              tasksJson: tasksJson,
              year: this.year,
              month: this.month
            }
        }
      );
    })
    .catch((error) => {
      alert("Tasks' JSON failed to load.")

      this.dispatch(
        {
          type: 'SET_TASK_JSON_DATA',
          payload:
            {
              tasksJson: [],
              month: this.month,
              year: this.year
            }
        }
      );
    });
  }
}

export default TaskJsonFetcherService;
