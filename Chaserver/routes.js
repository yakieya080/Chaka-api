// routes.js
import express from 'express';

const router = express.Router();

// Database salphaa (in-memory)
let influencers = [
    { id: 1, name: "Influencer-A", code: "YAKI10", commission: 0.10 },
    { id: 2, name: "Influencer-B", code: "CHAKA20", commission: 0.10 }
];

let referrals = []; 

// Endpoint: API testing
router.get('/', (req, res) => {
    res.json({ message: "API is working successfully!" });
});

// Endpoint: Referral galmeessuuf (POST)
router.post('/register-referral', (req, res) => {
    const { customer_name, referral_code } = req.body;

    const influencer = influencers.find(i => i.code === referral_code);
    
    if (influencer) {
        referrals.push({ 
            customer_name, 
            influencer_name: influencer.name, 
            timestamp: new Date() 
        });
        res.json({ message: "Galmee milkaa'ina!", influencer: influencer.name });
    } else {
        res.status(404).json({ message: "Koodiin kun hin jiru!" });
    }
});

// Endpoint: Referral-oota hunda arguuf (GET)
router.get('/referrals', (req, res) => {
    res.json(referrals);
});

export default router;
