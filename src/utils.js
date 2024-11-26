

// return true if num is a string containing a valid number
function isValidNum(num) {
    const pattern = /^\d+(\.\d+)?$/;
    return typeof(num) === "string" && pattern.test(num) && (num.length > 0);
};

export { isValidNum };