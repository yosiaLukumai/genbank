import app from './app';
import config from './config/config';
import { ConnectToDatabase } from './config/databaseconnection';
import { send_email } from './services/sendemail';

ConnectToDatabase();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

// test send_email
// send_email(["embedxhq@gmail.com"], "test email");