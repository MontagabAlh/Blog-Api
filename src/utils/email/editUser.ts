import transporter from "./transporter";

const editUser = async (email: string, isAdmin: boolean): Promise<void> => {
    try {
        await transporter.sendMail({
            from: `"Qubefyn Support" <${process.env.MAIL_USERNAME}>`, 
            to: email,
            subject: 'Admin',
            text: `${isAdmin ? "You've become an Admin":"You're not an Admin"}`, 
            html: `<div><p>${isAdmin ? "I've become an admin" : "You have been removed from the position of admin"}</p></div>`, 
        });
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};

export default editUser;
