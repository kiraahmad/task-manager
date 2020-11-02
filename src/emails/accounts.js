const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ksalama927@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}, Let me know how you get along with the app` 
    });
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ksalama927@gmail.com',
        subject: "I'm sorry to see you leave!",
        text: `Goodbye, ${name}, Is there anything we could have done to have kept you on board?`
    });
}
module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}