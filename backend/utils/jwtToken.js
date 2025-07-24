const sendToken = (user, statusCode, res) => {
  // Create Jwt token
  const token = user.getJwtToken();

  // Ensure COOKIE_EXPIRES_TIME is correctly parsed
  const cookieExpireTime = Number(process.env.COOKIE_EXPIRES_TIME) || 7; // Default to 7 days if undefined

  // Options for cookie
  const options = {
    expires: new Date(Date.now() + cookieExpireTime * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

export default sendToken;
