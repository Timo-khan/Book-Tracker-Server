const validateUsername = (username) => {
    const pattern = /^[a-zA-Z0-9]{3,}$/;
    return pattern.test(username);
};

export default validateUsername;
