import nodemailer from 'nodemailer';

async function mailer(subject: string, message: string) {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "codeconcept.contact@gmail.com",
      pass: "codeconcept!!!!",
    },
  });

  let info = await transporter.sendMail({
    from: '"CodeConcept 👻" <codeconcept.contact@gmail.com>',
    to: "codeconcept.contact@gmail.com",
    subject: subject,
    text: message, 
  });

//   console.log("Message sent: %s", info.messageId);
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

export default mailer;