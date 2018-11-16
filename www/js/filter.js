myApp.filter("formatdate", function ($filter) {
  return function (timestamp) {
    var currentDate = new Date();
    var toFormat = new Date(timestamp);
    if (
      toFormat.getDate() == currentDate.getDate() &&
      toFormat.getMonth() == currentDate.getMonth() &&
      toFormat.getFullYear() == currentDate.getFullYear()
    ) {
      return "Today " + $filter("date")(toFormat.getTime(), "HH:mm");
    }
    if (
      toFormat.getDate() == currentDate.getDate() - 1 &&
      toFormat.getMonth() == currentDate.getMonth() &&
      toFormat.getFullYear() == currentDate.getFullYear()
    ) {
      return "Yesterday " + $filter("date")(toFormat.getTime(), "HH:mm");
    }
    if (
      toFormat.getDate() == currentDate.getDate() + 1 &&
      toFormat.getMonth() == currentDate.getMonth() &&
      toFormat.getFullYear() == currentDate.getFullYear()
    ) {
      return "Tomorrow " + $filter("date")(toFormat.getTime(), "HH:mm");
    }

    return $filter("date")(toFormat.getTime(), "dd/MM/yyyy HH:mm");
  };
});
