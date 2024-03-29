'use strict';

const mailer = require('nodemailer');
const skeleton = fs.readFileSync('./src/templates/email_skel.html').toString('utf8');

var postman = {};

module.exports = postman;

postman.init = () => {

   const email = mailer.createTransport({
       service: appConfig.smtp_service.name,
       auth: {
           user: appConfig.smtp_service.username,
           pass: appConfig.smtp_service.password
       }
   });

   postman._email = email;

};

postman.verifyAccountEmail = user => {
   if(user instanceof User)
      user = user.record;
   let core_text = coreTextCache[user.lang];

   if(!user.email)
      return Promise.resolve(false);

   return postman.email({
      to: user.email,
      link: `${appConfig.site_protocol}://${appConfig.domain_name}/verifyemail/${user.verify_email_token}`,
      subject: core_text.email_verify_subject,
      teaser_text: core_text.email_verify_teaser,
      main_text: core_text.email_verify_main_text,
      title: core_text.email_verify_title,
      unsubscribe_question: core_text.unsubscribe_question,
      copyright_stamp: core_text.copyright_stamp,
      unsubscribe_link: `${appConfig.site_protocol}://${appConfig.domain_name}/unsubscribeall/${user.unsubscribe_all_token}`
   });
};

postman.sendForgotPasswordEmail = user => {
   if(user instanceof User)
      user = user.record;
   let core_text = coreTextCache[user.lang];

   if(!user.email)
      return Promise.resolve(false);

   return postman.email({
      to: user.email,
      link: `${appConfig.site_protocol}://${appConfig.domain_name}/?recoverpass=${user.fpass_token}`,
      subject: core_text.email_password_recovery_instructions_subject,
      teaser_text: core_text.email_password_recovery_instructions_teaser,
      main_text: core_text.email_password_recovery_instructions_main_text,
      title: core_text.email_password_recovery_instructions_title,
      unsubscribe_question: core_text.unsubscribe_question,
      copyright_stamp: core_text.copyright_stamp,
      unsubscribe_link: `${appConfig.site_protocol}://${appConfig.domain_name}/unsubscribeall/${user.unsubscribe_all_token}`
   });
};

postman.welcome = user => {
   if(user instanceof User)
      user = user.record;
   let core_text = coreTextCache[user.lang];

   if(!user.email || user.unsubscribe_all_email)
      return Promise.resolve(false);

   return postman.email({
      to: user.email,
      subject: core_text.email_welcome_subject,
      teaser_text: core_text.email_welcome_teaser_text,
      main_text: core_text.email_welcome_text,
      title: core_text.email_welcome_title,
      unsubscribe_question: core_text.unsubscribe_question,
      copyright_stamp: core_text.copyright_stamp,
      unsubscribe_link: `${appConfig.site_protocol}://${appConfig.domain_name}/unsubscribeall/${user.unsubscribe_all_token}`
   });
};

postman.email = options => co(function*(){

   if(!options.from)
      options.from = appConfig.default_email_from;

   if(!options.subject)
      options.subject = appConfig.default_email_subject;

   options.text = `${options.title}\n\n${options.main_text}\n\n${options.link||''}\n\nUnsubscribe: ${options.unsubscribe_link}`;

   options.html = skeleton;
   options.html = options.html.replace(':unsubscribe_question', options.unsubscribe_question);
   options.html = options.html.replace(':unsubscribe_url', options.unsubscribe_link);
   options.html = options.html.replace(':teaser_text', options.teaser_text);
   options.html = options.html.replace(':text', options.main_text);
   options.html = options.html.replace(':title', options.title);
   options.html = options.html.replace(':copyright_stamp', options.copyright_stamp);
   options.html = options.html.replace(':email_link', options.link ? `${options.link}<br/><br/>` : '');
   options.html = options.html.replace(':head_image', `${appConfig.site_protocol}://${appConfig.domain_name}/img/emailhead.gif`);

   if(!(yield increment_email(options.to)))
      return Promise.resolve(false);

   return yield postman._email.sendMail(options);

});
