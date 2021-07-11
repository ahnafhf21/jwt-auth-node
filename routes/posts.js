const router = require("express").Router();
const verify = require('./verifyToken');

router.get("/", verify, (req, res) => {
//   res.send({
//     posts: {
//       title: "this is my title",
//       description: "random data you shouln`t access",
//     },
//   });
    res.send(req.user);
});

module.exports = router;
