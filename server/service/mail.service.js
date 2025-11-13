import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendMail = async ({to , subject , text, html }) => {
  try {
    const mailOptions = {
      from: {
        name: "Ecommerce App",
        address: process.env.MAIL_ID,
      },
      to,
      subject,
      text,
      html
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error while sending mail", { error });
    throw error
  }
};


