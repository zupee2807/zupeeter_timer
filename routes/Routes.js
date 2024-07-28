const express = require("express");
const { getGameHistory, getMyHistory, placeBetTrx } = require("../controller");
const router = express.Router();

router.post("/trx_result-node", getGameHistory);
router.post("/trx-my-history-node", getMyHistory);
router.post("/bid-placed-node", placeBetTrx);

module.exports = router;
