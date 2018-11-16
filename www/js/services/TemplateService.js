myApp.service("TemplateService", function () {
  //   this.userServerSocket;
  this.ratesServerSocket;
  this.sportsBookServerSocket;

  this.connectSocket = function () {
    if (!this.ratesServerSocket) {
      this.ratesServerSocket = io(adminUUU, {
        forceNew: true
      });
      this.ratesServerSocket.on("connect", function onConnect() {});
    }
    if (!this.sportsBookServerSocket) {
      this.sportsBookServerSocket = io(sportsSocket, {
        forceNew: true
      });
      this.sportsBookServerSocket.on("connect", function onConnect() {});
    }
    // if (!this.userServerSocket) {
    //   this.userServerSocket = io(mainServer, {
    //     forceNew: true
    //   });
    //   this.userServerSocket.on("connect", function onConnect() {});
    // }
  };
});
