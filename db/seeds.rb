[
  {name: 'Task 1', start_date: '27-10-2019', end_date: '09-12-2019'},
  {name: 'Task 2', start_date: '27-10-2019', end_date: '29-10-2019'},
  {name: 'Task 3', start_date: '29-10-2019', end_date: '06-11-2019'},
  {name: 'Task 4', start_date: '31-10-2019', end_date: '03-11-2019'},
  {name: 'Task 5', start_date: '05-11-2019', end_date: '05-11-2019'},
  {name: 'Task 6', start_date: '05-11-2019', end_date: '07-11-2019'},
  {name: 'Task 7', start_date: '05-11-2019', end_date: '09-11-2019'},
  {name: 'Task 8', start_date: '06-11-2019', end_date: '06-11-2019'},
  {name: 'Task 9', start_date: '08-11-2019', end_date: '09-11-2019'},
  {name: 'Task 10', start_date: '09-11-2019', end_date: '09-11-2019'},
  {name: 'Task 11', start_date: '13-11-2019', end_date: '01-12-2019'},
  {name: 'Task 12', start_date: '29-11-2019', end_date: '30-11-2019'}
].each do |params|
  Task.create!(
    name: params[:name],
    start_date: DateTime.parse(params[:start_date]),
    end_date: DateTime.parse(params[:end_date])
  )
end
