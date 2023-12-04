const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} ${req.method} ${req.url} ${req.ip}`);
    next();
}; 

// const logger = (options) =>
//     (req, res, next) => {
//         const timestamp = new Date().toISOString();
//         const { method, url, ip } = req;
//         console.log(`${timestamp} ${options.level} ${method} ${url} ${ip}`);
//         next();
//     };

module.exports = logger;