import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcrypt from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        // create a hased token
        const hashedToken = await bcrypt.hash(userId.toString(), 10);
        //TODO: configure mail for usage

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId,
                {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                }
            )
        }else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000,
                }
            )
        }
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "265a59d356709f", //hona nhi chahiye tha 
              pass: "cc0c327bcca452" //hona nhi chahiye tha
            }
          });

        const mailOptions = {
            from: 'anshika@gmail.com', // sender address
            to: email,
            subject: emailType === 'VERIFY' ? 'Verify Your Email' : 'Reset your Password', // Subject line
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType=="VERIFY" ?"Verify Your Email": 'Reset your Password'}
            or copy and paste the link below in your browser.<br>
            ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`, // html body
        };

        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse;

    } catch (error: any) {
        throw new Error(error.messsage)
    }
}