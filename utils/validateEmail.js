const validateEmail = (email) => {
    const pattern = /^[a-z\d]+[\w.-]@[a-z\d]+[a-z\d-]\.[a-z]{2,63}$/i;
    return pattern.test(email);
};

export default validateEmail;