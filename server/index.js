const ApplicationServerConfiguration = require("./configuration/app-config");
const ApplicationServer = require("./application-server");

let applicationServer = new ApplicationServer(ApplicationServerConfiguration);

applicationServer.StartServer().catch(err => {
    console.error(err);
    process.exit(1);
});