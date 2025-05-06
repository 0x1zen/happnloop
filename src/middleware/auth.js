// middleware.js
const userAuth = (req, res, next) => {
    const token = "xy";
    const auth = token === "xyz";  // Always false in this case
    if (!auth) {
        return res.status(401).send("Authorization Failed");
    }
    next();
};

const adminAuth = (req, res, next) => {
    const token = "xyz";
    const auth = token === "xyz";
    if (!auth) {
        return res.status(401).send("Authorization Failed");
    }
    next();
};

module.exports = {
    adminAuth,
    userAuth,
};
