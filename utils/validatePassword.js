const validatePassword = (password) => {
    const pattern =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,16}$/;
        
    return pattern.test(password);
};

export default validatePassword;