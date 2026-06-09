// routes.js
import express from 'express';

const router = express.Router();

// Asitti daandiiwwan (endpoints) API kee uumi
router.get('/', (req, res) => {
    res.json({ message: "API is working successfully!" });
});

// Yoo endpoint biraa qabaatte asitti itti fufi
// router.get('/users', (req, res) => { ... });

export default router;
