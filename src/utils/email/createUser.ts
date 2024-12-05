import transporter from "./transporter";

const createUser = async (username: string, email: string, password: string): Promise<void> => {
    try {
        await transporter.sendMail({
            from: `"Qubefyn Support" <${process.env.MAIL_USERNAME}>`,
            to: email,
            subject: 'Your Account Info',
            text: `Your Username: ${username}`,
            html: `<div><p>Your Username: ${username}</p><p>Your Email: ${email}</p><p>Your Password: ${password}</p><p>This is your account information</p></div>`,
        });
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};

export default createUser;
