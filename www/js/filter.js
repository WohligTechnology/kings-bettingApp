myApp
  .filter("formatdate", function ($filter) {
    return function (timestamp) {
      var currentDate = new Date();
      var toFormat = new Date(timestamp);
      if (
        toFormat.getDate() == currentDate.getDate() &&
        toFormat.getMonth() == currentDate.getMonth() &&
        toFormat.getFullYear() == currentDate.getFullYear()
      ) {
        return "Today " + $filter("timezoneformate")(toFormat.getTime(), "HH:mm");
      }
      if (
        toFormat.getDate() == currentDate.getDate() - 1 &&
        toFormat.getMonth() == currentDate.getMonth() &&
        toFormat.getFullYear() == currentDate.getFullYear()
      ) {
        return "Yesterday " + $filter("timezoneformate")(toFormat.getTime(), "HH:mm");
      }
      if (
        toFormat.getDate() == currentDate.getDate() + 1 &&
        toFormat.getMonth() == currentDate.getMonth() &&
        toFormat.getFullYear() == currentDate.getFullYear()
      ) {
        return "Tomorrow " + $filter("timezoneformate")(toFormat.getTime(), "HH:mm");
      }

      return $filter("timezoneformate")(toFormat.getTime(), "dd/MM/yyyy HH:mm");
    };
  })
  .filter("timezoneformate", function ($filter, $rootScope, $state) {
    return function (date, format) {
      var currentTimezone = $.jStorage.get("timezone");
      var formattedDate = date;
      if (!format) {
        format = "dd/MM/yyyy HH:mm:ss";
      }
      //using new Date(working)
      $rootScope.gmtComputerTime = $filter("gmtfiter")(new Date(formattedDate));
      if (currentTimezone == "computer") {
        var timezone = $filter("gmtfiter")(new Date(formattedDate));
        formattedDate = $filter("date")(
          new Date(formattedDate),
          format,
          timezone.toString()
        );
        $rootScope.gmtTime = timezone;
      } else if (currentTimezone == "system") {
        formattedDate = $filter("date")(new Date(formattedDate), format, "UTC");
        $rootScope.gmtTime = "GMT +00:00";
      } else {
        formattedDate = $filter("date")(
          new Date(formattedDate),
          format,
          "+0530"
        );
        $rootScope.gmtTime = "GMT +05:30";
      }
      return formattedDate;
    };
  })
  .filter("gmtfiter", function () {
    return function (date) {
      var timeOffset = new Date(date).getTimezoneOffset() / 60;
      var timeOffsetString = "GMT ";
      var hours = timeOffset / 1 - (timeOffset % 1);
      if (timeOffset / 1 - (timeOffset % 1) < 0) {
        var hours = hours * -1;
      }
      var mins = (timeOffset % 1) * -1;

      if (mins % 1 == 0.5) {
        mins = "30";
      } else {
        mins = "00";
      }
      if (timeOffset > 0) {
        timeOffsetString +=
          "-" + (hours < 10 ? "0" + hours : hours) + ":" + mins;
      } else {
        timeOffsetString +=
          "+" + (hours < 10 ? "0" + hours : hours) + ":" + mins;
      }
      return timeOffsetString;
    };
  });
