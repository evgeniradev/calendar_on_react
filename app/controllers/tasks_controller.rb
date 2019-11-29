class TasksController < ApplicationController
  skip_before_action :verify_authenticity_token, only: %i[create update]

  def create
    Task.create!(
      name: task_params[:name],
      start_date: DateTime.parse(task_params[:start_date]),
      end_date: DateTime.parse(task_params[:end_date])
    )
  end

  def update
    Task.find(params[:id]).update!(task_params)
  end

  private

  def task_params
    params.require(:task).permit(:name, :start_date, :end_date)
  end
end
