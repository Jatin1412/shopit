// middleware for catchAsyncErrors

export default (controllerFunction) => {
  return (req, res, next) => {
    return Promise.resolve(controllerFunction(req, res, next)).catch(next);
  };
};
