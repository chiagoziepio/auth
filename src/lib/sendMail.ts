import nodemailer from "nodemailer";

export const sendMail = async (email: string, token: string) => {
  const verificationTokenConfirmationLink = `http://localhost:3000/auth/verify?token=${token}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSKEY,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirmation Email",
    html: `<h1>Click here to verify your email \n 
        <a href ="${verificationTokenConfirmationLink}" style={{
        width: 120px; height: 40px; display:flex; justify-item: center; align-item: center; background-color:blue; color: white; border: 1px solid black; }}>Confirm here</a>
     </h1>`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false };
  }
};
