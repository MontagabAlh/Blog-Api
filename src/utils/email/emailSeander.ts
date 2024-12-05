import transporter from "./transporter";


const sendOtpEmail = async (otp: string, email: string): Promise<void> => {
    try {
        await transporter.sendMail({
            from: `"Qubefyn Support" <${process.env.MAIL_USERNAME}>`, 
            to: email,
            subject: 'Your OTP Code', 
            text: `Your OTP code is: ${otp}`, 
            html: `<div><p>Your Email: ${email}</p><p>Your OTP code is: ${otp}</p><p>This code is valid for 5 minutes</p></div>`, 
        });
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};

export default sendOtpEmail;
