class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :startDate, :endDate

  def startDate
    object.start_date.strftime('%d-%m-%Y')
  end

  def endDate
    object.end_date.strftime('%d-%m-%Y')
  end
end
