

// return true if num is a string containing a valid number
function isValidNum(num) {
    const pattern = /^\d+(\.\d+)?$/;
    return typeof(num) === "string" && pattern.test(num) && (num.length > 0);
};

// check if a password meets requirements
function isPasswordValid(password) {
    let errors = [];
    if (password.length < 8) {
        errors.push("Password should be at least 8 characters long.");
    };
    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}":;'<>?,./]).*$/.test(password)) {
        errors.push("Password should include at least one uppercase and one lowercase letter, at least one number, and at least one special character.");
    };
    if (/^(?=.*\s).*$/.test(password)) {
        errors.push("Password should not contain whitespaces.");
    };
    return errors.length > 0 ? {ok: false, errors: errors} : {ok: true, errors: []} ;
}

export { isValidNum, isPasswordValid };