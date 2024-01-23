const express = require("express");

const router = express.Router();

//controller
const cvController = require("../controllers/cvController");

router.get("/index", ()=> {
    console.log("AQUI");
});
router.get("/cv", cvController.getCvs);
router.get("/cv/:id", cvController.getCvFile);
router.post("/cv", cvController.postCv);
router.put("/cv/:id", cvController.updateCv);
router.delete("/cv/:id", cvController.deleteCv);

module.exports = router;
