function palindrome(str) {
    var str = str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    var str2 = str.split("").reverse().join("");
    if (str !== str2) {
        return false;
    }

    return true;
}

palindrome("eye");