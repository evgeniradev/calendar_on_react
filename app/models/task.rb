class Task < ApplicationRecord
  validates :name, :start_date, :end_date, presence: true
  validate :end_date_is_larger_than_start_date

  def self.for_period(year, month)
    date = Time.new(year, month)
    date_beginning = date.at_beginning_of_month - 2.weeks
    date_end = date.at_end_of_month + 2.weeks

    where('start_date >= ?', date_beginning)
      .where('start_date <= ?', date_end)
      .or(
        where('start_date <= ?', date_beginning)
          .where('end_date >= ?', date_end)
      )
      .or(
        where('start_date <= ?', date_beginning)
          .where('end_date >= ?', date_beginning)
          .where('end_date <= ?', date_end)
      )
      .order(:start_date)
  end

  private

  def end_date_is_larger_than_start_date
    return unless start_date && end_date && start_date > end_date

    errors.add(:start_date, "can't be larger than end_date")
  end
end
