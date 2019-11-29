class CalendarController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :tasks

  def index
  end

  def tasks
    render json: Task.for_period(params[:year], params[:month])
  end
end
