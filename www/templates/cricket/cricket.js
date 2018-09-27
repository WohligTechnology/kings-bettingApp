myApp.controller('CricketCtrl', function ($scope, TemplateService, NavigationService) {
    $scope.template = TemplateService.getHTML("content/cricket/cricket.html");
    TemplateService.title = "Cricket"; //This is the Title of the Website
    TemplateService.sidemenu2 = "";
    $scope.navigation = NavigationService.getNavigation();
    // alert("bro its cricket",$scope.date);

    console.log("bro its cricket", $scope.itemArray);
});