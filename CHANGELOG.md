## [1.0.2](https://github.com/gkampitakis/email-client/compare/v1.0.1...v1.0.2) (2020-11-14)


### Bug Fixes

* update email client dependencies ([04d24a1](https://github.com/gkampitakis/email-client/commit/04d24a15ec2f51ea9c3ed908694ee247ec46eb47))

## [1.0.1](https://github.com/gkampitakis/email-client/compare/v1.0.0...v1.0.1) (2020-10-27)


### Bug Fixes

* update dependencies ([f03e566](https://github.com/gkampitakis/email-client/commit/f03e566e1d4258c247d01f5f4c1218b8a3130ee8))

# 1.0.0 (2020-09-17)


### Bug Fixes

* add support for signle or multiple cc/bcc recipients ([ae1517a](https://github.com/gkampitakis/email-client/commit/ae1517a74ee6cb314e732ad585a2ca1a340bed3f))
* add unknown type in attachments ([3e7199a](https://github.com/gkampitakis/email-client/commit/3e7199a9f32af5a7cb23dad1f3986e8ae233e6e9))
* better filter files passed on send and minor fix on tests ([2bc2ea5](https://github.com/gkampitakis/email-client/commit/2bc2ea534d6193a2c85479a3614fe69ce5274796))
* broken types ([1a4f198](https://github.com/gkampitakis/email-client/commit/1a4f1987bb3f36179414d952867ebb68fa8c7fcf))
* bug with message transform on sendgrid ([517b46f](https://github.com/gkampitakis/email-client/commit/517b46fd9354f641b8b683413630cce263d9ed04))
* change field name to filename on attachment factory ([d7777c2](https://github.com/gkampitakis/email-client/commit/d7777c2a7587f9d71046ccbf4d4490f840cc0d5e))
* drop support for mandrill ([4edeaf0](https://github.com/gkampitakis/email-client/commit/4edeaf017fe035d6b049a03a774d811f83ed4d30))
* made the transporter not to be static var ([fff5527](https://github.com/gkampitakis/email-client/commit/fff55279c31af44d22084610393b028beb70b9db))
* method transformmessage method to transporters ([647242b](https://github.com/gkampitakis/email-client/commit/647242b3561dc8afd16cad9698abdcc676c83a56))
* pasing only region didn't update AWS config ([94b633a](https://github.com/gkampitakis/email-client/commit/94b633ab424aa5ab0989bb9a279f3b1c27ade54b))
* replace file-type with mime-types module ([ee3b60f](https://github.com/gkampitakis/email-client/commit/ee3b60f1b1231b2975b44f2befc5fc712780c125))
* set up repository for deploying ([d7a45b9](https://github.com/gkampitakis/email-client/commit/d7a45b9d462c11430d002d569b4f53f873ae64ad))
* start implementing the attachments feature ([666856d](https://github.com/gkampitakis/email-client/commit/666856dc02d65a12f5e7a650324077aee2483a2e))
* support for multiple recipients ([bec6479](https://github.com/gkampitakis/email-client/commit/bec6479cd483f62390c0076539d02532e3376aa6))
* update dependencies ([85f3689](https://github.com/gkampitakis/email-client/commit/85f3689fb11e50dd0f5907a432b6cca50290b68e))
* **deps:** update broken dependency of internal module ([4c7f1bc](https://github.com/gkampitakis/email-client/commit/4c7f1bcbb1021ab85c2d8af1596baa01c8881f29))


### Features

* add support for optional naming in attachments ([1e712b1](https://github.com/gkampitakis/email-client/commit/1e712b1c81d078d50780c3000650441314192b40))
* add support for sending html directly ([5f70d74](https://github.com/gkampitakis/email-client/commit/5f70d74fce053c843335d7af6046ad516c8577f8))
* expose tranporter core module ([80fd99c](https://github.com/gkampitakis/email-client/commit/80fd99cb3ffc72c625f29443df8740bfd00ce5b4))
* implement AttachmentFactory class ([683b84e](https://github.com/gkampitakis/email-client/commit/683b84e1dcf23e579747ab8030a9fc0197b08007))
* implement aws-ses transporter ([ce8c23a](https://github.com/gkampitakis/email-client/commit/ce8c23af354d935cd0388001265adfce8781f8a3))
* refactor module ([6edf067](https://github.com/gkampitakis/email-client/commit/6edf06702e27c205f27528316b403bf94354144c))
* support aws attachments and bcc/cc recipients ([c267ea3](https://github.com/gkampitakis/email-client/commit/c267ea319a656c6c658c70d38399fc2b2e9f7e74))
* support mailgun attachments and bcc/cc recipients ([b0bdd06](https://github.com/gkampitakis/email-client/commit/b0bdd062fa9412373d828c1bc8dc1284a0038416))
* support mandrill attachments and bcc/cc recipients ([b01d3c8](https://github.com/gkampitakis/email-client/commit/b01d3c8b061f067849ef1f1e3cc7f8f7249af859))
* support postmark attachments and bcc/cc recipients ([c303717](https://github.com/gkampitakis/email-client/commit/c3037170f6b3cb79ead031b8418352211b3906ce))
* sync transporters to new changes ([7f2f174](https://github.com/gkampitakis/email-client/commit/7f2f1749b83ca7195ee54b6ad46d137eda0586b1))
* **handlebars:** add support for configuring handlebars compilation ([1528a70](https://github.com/gkampitakis/email-client/commit/1528a7052270fe12fcb219d0bbc7812edc581bdd))
* **support:** change on release tools ([4583808](https://github.com/gkampitakis/email-client/commit/4583808cf83ab85e20d337079c3d3bcf0d85d5f7))
* **transport:** introduce support for mailgun transporter ([fab65cc](https://github.com/gkampitakis/email-client/commit/fab65cccc26165f189cff71812025e9eefdabea3))
* **transporter:** implement mandrill email transporter ([95a9d0c](https://github.com/gkampitakis/email-client/commit/95a9d0cfa4be6f7a02ddfa33315095019a75d86e))
* **transporter:** implement postmark email transporter ([b874dfe](https://github.com/gkampitakis/email-client/commit/b874dfe908e64aaf6eb5f629ae68b026a0258eae))


### BREAKING CHANGES

* drop support mandrill transportery
