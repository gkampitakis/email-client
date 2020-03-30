# EmailClient

# Email-Client

It's a module created for personal use on node servers for typescript and javascript for sending 
emails.

## Usage

Install the module:<br/>
<br/>
```npm install @gkampitakis/email-client --save```

First thing you must initialize the client before using it.

```
import { EmailClient } from '@gkampitakis/email-client';

 EmailProvider.setup({
      sendGridApiKey: <sendgrid api key>,
      templatesFolder: <Folder name of the handlebars templates>,
      sender: <email name from which your service sends the email>,
      supportedEmailTypes: <Array of strings of supported email types, they must be the same with handlebars file names>
    });
``` 
**Example**:

```
 await this.emailClient.send(email, 'Password Reset', {
          token: result.token
        },
          'changePassword'
        );
```

## Future Work

-  Make it more generic
-  Not only supporting sendgrid
-  Support different libraries
-  templates should not be mandatory there should be could be plain text support as well

## Author and Maintainer

[Georgios Kampitakis](gkampitakis.github.io)