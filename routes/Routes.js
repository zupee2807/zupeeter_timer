const express = require("express");
const { getGameHistory, getMyHistory, placeBetTrx, get_Royality_Date } = require("../controller");
const { insertOneMinTrxResultByCron } = require("../controller/OneMinTrx");
const router = express.Router();

router.post("/trx_result-node", getGameHistory);
router.post("/trx-my-history-node", getMyHistory);
router.post("/bid-placed-node", placeBetTrx);
router.get("/get-royality-date", get_Royality_Date);
router.get("/insert-trx_result_ovi",insertOneMinTrxResultByCron);
module.exports = router;
