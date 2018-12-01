// JavaScript Document
myApp.filter("myFilter", function() {
  // In the return function, we must pass in a single parameter which will be the data we will work on.
  // We have the ability to support multiple other parameters that can be passed into the filter optionally
  return function(input, optional1, optional2) {
    var output;

    // Do filter work here
    return output;
  };
});

myApp.filter("indianCurrency", function() {
  return function(getNumber) {
    if (!isNaN(getNumber)) {
      var numberArr = getNumber.toString().split(".");
      var lastThreeDigits = numberArr[0].substring(numberArr[0].length - 3);
      var otherDigits = numberArr[0].substring(0, numberArr[0].length - 3);
      if (otherDigits != "") {
        lastThreeDigits = "," + lastThreeDigits;
      }
      var finalNumber =
        otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThreeDigits;
      if (numberArr.length > 1) {
        var getRoundedDecimal = parseInt(numberArr[1].substring(0, 2)) + 1;
        finalNumber += "." + getRoundedDecimal;
      }
      // return '₹' + finalNumber;
      return finalNumber;
    }
  };
});
myApp.filter("gmtfiter", function() {
  return function(date) {
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
      timeOffsetString += "-" + (hours < 10 ? "0" + hours : hours) + ":" + mins;
    } else {
      timeOffsetString += "+" + (hours < 10 ? "0" + hours : hours) + ":" + mins;
    }
    return timeOffsetString;
  };
});

myApp.filter("timezoneformate", function($filter, $rootScope, $state) {
  return function(date, format) {
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
      formattedDate = $filter("date")(new Date(formattedDate), format, "+0530");
      $rootScope.gmtTime = "GMT +05:30";
    }
    //using moment (working)
    // if (currentTimezone == "computer") {
    //   formattedDate = moment()
    //     .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
    //     .format("LLLL");
    // } else if (currentTimezone == "system") {
    //   formattedDate = moment()
    //     .utc()
    //     .format("LLLL");
    // } else {
    //   formattedDate = moment()
    //     .tz("Asia/Calcutta")
    //     .format("LLLL");
    // }
    return formattedDate;
  };
});

myApp.filter("formatdate", function($filter) {
  return function(timestamp) {
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
