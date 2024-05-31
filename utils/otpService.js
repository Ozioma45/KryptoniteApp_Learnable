exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.verifyOTP = (redisClient, email, otp, callback) => {
  redisClient.get(email, (err, reply) => {
    if (err) return callback(err, false);
    if (reply !== otp) return callback(null, false);
    callback(null, true);
  });
};
