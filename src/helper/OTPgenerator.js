export const OTPGen = () => {
    let OTP = '';

    for (let i = 0; i < 4; i++) {
        let random = Math.floor(Math.random() * 10);
        OTP += random;
    }

    return OTP;
};
