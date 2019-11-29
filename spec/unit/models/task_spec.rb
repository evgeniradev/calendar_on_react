require 'rails_helper'

RSpec.describe Task do
  describe 'Task validation' do
    it 'is valid' do
      task =
        Task.new(
          name: 'Task',
          start_date: Time.current,
          end_date: Time.current.tomorrow
        )

      expect(task.valid?).to be(true)
    end

    it 'is invalid if name is missing' do
      task =
        Task.new(
          start_date: Time.current,
          end_date: Time.current.tomorrow
        )

      expect(task.valid?).to be(false)
    end


    it 'is invalid if start_date is missing' do
      task =
        Task.new(
          name: 'Task',
          end_date: Time.current.tomorrow
        )

      expect(task.valid?).to be(false)
    end

    it 'is invalid if end_date is missing' do
      task =
        Task.new(
          name: 'Task',
          start_date: Time.current
        )

      expect(task.valid?).to be(false)
    end

    it 'is invalid if start_date is larger than end_date' do
      task =
        Task.new(
          name: 'Task',
          start_date: Time.current.tomorrow,
          end_date: Time.current
        )

      expect(task.valid?).to be(false)
    end
  end
end
