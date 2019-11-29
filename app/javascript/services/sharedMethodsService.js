class SharedMethodsService {
  static getDateValues(dateString) {
    const dateStringYear = dateString.substring(6,11);
    const dateStringMonth = parseInt(dateString.substring(3,5) - 1);
    const dateStringDate = dateString.substring(0,2);

    return [dateStringYear, dateStringMonth, dateStringDate];
  }
}

export default SharedMethodsService;
