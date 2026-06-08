import { Router, type IRouter } from "express";
import axios from "axios";
import { distributeMlmCommission } from "../lib/mlm.js";

const router: IRouter = Router();

const CHAPA_SECRET_KEY =
  process.env["CHAPA_SECRET_KEY"] ??
  "CHASECK_TEST-rjbju3gXYfsxmSPur1RoNxxGRVH7hcXC";

const CALLBACK_URL =
  process.env["CALLBACK_URL"] ?? "https://your-domain.com/api/payment-callback";

router.post("/pay/chapa", async (req, res) => {
  const { amount, phone, email, tx_ref } = req.body as {
    amount: number;
    phone: string;
    email?: string;
    tx_ref?: string;
  };

  try {
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount,
        currency: "ETB",
        email: email ?? "test@chakagebeya.com",
        phone_number: phone,
        tx_ref: tx_ref ?? `TX-${Date.now()}`,
        callback_url: CALLBACK_URL,
      },
      {
        headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` },
      },
    );

    if (response.data?.status === "success") {
      res.json({ success: true, checkout_url: response.data.data.checkout_url });
    } else {
      res.status(400).json({ success: false });
    }
  } catch {
    res.status(500).json({ success: false });
  }
});

router.post("/payment-callback", (req, res) => {
  const paymentData = req.body as {
    status: string;
    phone_number?: string;
    amount?: number;
  };

  if (paymentData.status === "success" && paymentData.phone_number && paymentData.amount != null) {
    distributeMlmCommission(paymentData.phone_number, paymentData.amount);
  }

  res.sendStatus(200);
});

export default router;
