export default (user, statueCode, res) => {
    // Create jwt token
    const token = user.getjwtToken();

    // Options for cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000),
        httpOnly : true
    }

    res.status(statueCode).cookie("token", token, options).json({
        token,
    })
}