# 1.0.0 (2020-04-24)


### Bug Fixes

* add support for signle or multiple cc/bcc recipients ([ae1517a](https://github.com/gkampitakis/email-client/commit/ae1517a74ee6cb314e732ad585a2ca1a340bed3f))
* better filter files passed on send and minor fix on tests ([2bc2ea5](https://github.com/gkampitakis/email-client/commit/2bc2ea534d6193a2c85479a3614fe69ce5274796))
* bug with message transform on sendgrid ([517b46f](https://github.com/gkampitakis/email-client/commit/517b46fd9354f641b8b683413630cce263d9ed04))
* change field name to filename on attachment factory ([d7777c2](https://github.com/gkampitakis/email-client/commit/d7777c2a7587f9d71046ccbf4d4490f840cc0d5e))
* made the transporter not to be static var ([fff5527](https://github.com/gkampitakis/email-client/commit/fff55279c31af44d22084610393b028beb70b9db))
* method transformmessage method to transporters ([647242b](https://github.com/gkampitakis/email-client/commit/647242b3561dc8afd16cad9698abdcc676c83a56))
* start implementing the attachments feature ([666856d](https://github.com/gkampitakis/email-client/commit/666856dc02d65a12f5e7a650324077aee2483a2e))
* support for multiple recipients ([bec6479](https://github.com/gkampitakis/email-client/commit/bec6479cd483f62390c0076539d02532e3376aa6))


### Features

* **handlebars:** add support for configuring handlebars compilation ([1528a70](https://github.com/gkampitakis/email-client/commit/1528a7052270fe12fcb219d0bbc7812edc581bdd))
* **support:** change on release tools ([4583808](https://github.com/gkampitakis/email-client/commit/4583808cf83ab85e20d337079c3d3bcf0d85d5f7))
* **transport:** introduce support for mailgun transporter ([fab65cc](https://github.com/gkampitakis/email-client/commit/fab65cccc26165f189cff71812025e9eefdabea3))
* **transporter:** implement mandrill email transporter ([95a9d0c](https://github.com/gkampitakis/email-client/commit/95a9d0cfa4be6f7a02ddfa33315095019a75d86e))
* expose tranporter core module ([80fd99c](https://github.com/gkampitakis/email-client/commit/80fd99cb3ffc72c625f29443df8740bfd00ce5b4))
* **transporter:** implement postmark email transporter ([b874dfe](https://github.com/gkampitakis/email-client/commit/b874dfe908e64aaf6eb5f629ae68b026a0258eae))
* implement AttachmentFactory class ([683b84e](https://github.com/gkampitakis/email-client/commit/683b84e1dcf23e579747ab8030a9fc0197b08007))
* implement aws-ses transporter ([ce8c23a](https://github.com/gkampitakis/email-client/commit/ce8c23af354d935cd0388001265adfce8781f8a3))
* support aws attachments and bcc/cc recipients ([c267ea3](https://github.com/gkampitakis/email-client/commit/c267ea319a656c6c658c70d38399fc2b2e9f7e74))
* support mailgun attachments and bcc/cc recipients ([b0bdd06](https://github.com/gkampitakis/email-client/commit/b0bdd062fa9412373d828c1bc8dc1284a0038416))
* support mandrill attachments and bcc/cc recipients ([b01d3c8](https://github.com/gkampitakis/email-client/commit/b01d3c8b061f067849ef1f1e3cc7f8f7249af859))
* support postmark attachments and bcc/cc recipients ([c303717](https://github.com/gkampitakis/email-client/commit/c3037170f6b3cb79ead031b8418352211b3906ce))
