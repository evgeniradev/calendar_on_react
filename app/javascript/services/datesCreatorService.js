class DatesCreatorService {
  constructor(year, month) {
    this.year = year;
    this.month = month - 1;
    this.singleDay = 86400000;
  }

  call(year, month) {
    let tmp = this.obtainDatesAsUtcMs();
    tmp = this.groupDatesByWeek(tmp);
    tmp = this.addNonNativeDates(tmp);
    tmp = this.addGroupIfTotalGroupsLessThanSix(tmp);
    tmp = this.addDateStrings(tmp);
    tmp = this.removeWeekNumbers(tmp);

    return tmp;
  }

  obtainDatesAsUtcMs = () => {
    const startDate = Date.UTC(this.year, this.month, 1);
    const endDate = Date.UTC(this.year, this.month + 1, 0);
    const dates = [];
    let date = startDate;

    while(date <= endDate) {
      dates.push(date);
      date = date + this.singleDay;
    }

    return dates;
  }

  groupDatesByWeek = (dates) => {
    const datesByWeek = {};

    dates.forEach(date => {
      const week = this.getWeek(new Date(date));

      if (!(datesByWeek[week] instanceof Array))
        datesByWeek[week] = [];

      datesByWeek[week].push({ms: date, native: true});
    })

    return datesByWeek;
  }

  addNonNativeDates = (datesByWeek) => {
    const datesByWeekWithAddedNonNativeDates = {...datesByWeek};

    Object.keys(datesByWeekWithAddedNonNativeDates).forEach(weekNumber => {
      const datesGroup = [...datesByWeekWithAddedNonNativeDates[weekNumber]];

      while (datesGroup.length < 7) {
        if (new Date(datesGroup[0].ms).getUTCDay() != 1) {
          const newDate =
            {
              ms: datesGroup[0].ms - this.singleDay,
              native: false
            };
          datesGroup.unshift(newDate);
        }
        else {
          const newDate =
            {
              ms: datesGroup[datesGroup.length-1].ms + this.singleDay,
              native: false
            };
          datesGroup.push(newDate);
        }
      }

      datesByWeekWithAddedNonNativeDates[weekNumber] = datesGroup;
    })

    return datesByWeekWithAddedNonNativeDates;
  }

  addGroupIfTotalGroupsLessThanSix = (datesByWeek) => {
    let datesByWeekWithAddedGroup = {...datesByWeek};
    let weekNumbers = Object.keys(datesByWeekWithAddedGroup);

    weekNumbers.forEach(weekNumber => {
      datesByWeekWithAddedGroup[weekNumber] =
        [...datesByWeekWithAddedGroup[weekNumber]];
    })

    while (weekNumbers.length < 6) {
      const lastWeekNumber = weekNumbers[weekNumbers.length - 1];
      const nextWeekNumber = parseInt(lastWeekNumber) + 1;
      const datesGroup = datesByWeekWithAddedGroup[lastWeekNumber];
      const nextDate =
        {
          ms: datesGroup[datesGroup.length - 1].ms + this.singleDay,
          native: false
        };

      datesByWeekWithAddedGroup[nextWeekNumber] = [nextDate];

      datesByWeekWithAddedGroup =
        this.addNonNativeDates(datesByWeekWithAddedGroup);
      weekNumbers = Object.keys(datesByWeekWithAddedGroup);
    }

    return datesByWeekWithAddedGroup;
  }

  addDateStrings = (datesByWeek) => {
    const stringDatesByWeek = {...datesByWeek};

    Object.keys(stringDatesByWeek).forEach(weekNumber => {
      const datesGroup = [...stringDatesByWeek[weekNumber]];

      datesGroup.forEach(dateObject => {
        const date = new Date(dateObject.ms);
        const day = ('0' + date.getUTCDate()).slice(-2);
        const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
        const year = date.getUTCFullYear();
        const dateString = `${day}-${month}-${year}`;

        datesGroup[datesGroup.indexOf(dateObject)].string = dateString;
      })

      stringDatesByWeek[weekNumber] = datesGroup;
    })

    return stringDatesByWeek;
  }

  removeWeekNumbers = (datesByWeek) => {
    return Object.values(datesByWeek);
  }

  getWeek = function (date) {
    const dayNumber = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNumber);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
    let weekNumber = Math.ceil((((date - yearStart) / this.singleDay) + 1)/7);

    if (this.month == 11 && weekNumber == 1) {
      weekNumber = 53;
    } else if (this.month == 0 && weekNumber > 51) {
      weekNumber = 0;
    }

    return weekNumber;
  };
}

export default DatesCreatorService;
