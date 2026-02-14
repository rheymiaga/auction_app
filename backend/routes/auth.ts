import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import pool from "../config/db.js";
import { protect } from "../middleware/auth.js";
import upload from "./multer.js";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// ======================= COOKIE + JWT =======================
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 30 * 24 * 60 * 60 * 1000,
};

const generateToken = (id: number): string => {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ======================= AUTH =======================

// Register
router.post("/register", async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashedPassword]
        );

        const token = generateToken(newUser.rows[0].id);
        res.cookie("token", token, cookieOptions);
        res.status(201).json({ user: newUser.rows[0], token });
    } catch (err: any) {
        console.error("Error registering user:", err.message);
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const userData = user.rows[0];
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(userData.id);
        res.cookie("token", token, cookieOptions);
        res.json({ user: { id: userData.id, name: userData.name, email: userData.email }, token });
    } catch (err: any) {
        console.error("Error logging in:", err.message);
        res.status(500).json({ message: "Login failed", error: err.message });
    }
});

// Logged in user
router.get("/me", protect, async (req: Request, res: Response) => {
    res.json((req as any).user);
});

// Logout
router.post("/logout", (req: Request, res: Response) => {
    res.cookie("token", "", { ...cookieOptions, maxAge: 1 });
    res.json({ message: "Logged out successfully" });
});

// ======================= ITEMS =======================
// Post an item with image upload
router.post(
    "/items",
    protect,
    upload.single("image"),
    async (req: Request, res: Response) => {
        try {
            const { name, description, starting_price } = req.body;
            const price = parseFloat(starting_price);
            if (isNaN(price)) {
                return res.status(400).json({ message: "Invalid starting_price" });
            }

            const ownerId = (req as any).user?.id;
            if (!ownerId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const fileBuffer = req.file ? req.file.buffer : null;
            const fileMime = req.file ? req.file.mimetype : null;

            const newItem = await pool.query(
                `INSERT INTO items 
         (name, description, starting_price, owner_id, img_data, img_mime, created_at, status)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, FALSE) 
         RETURNING *`,
                [name, description, price, ownerId, fileBuffer, fileMime]
            );

            return res.json(newItem.rows[0]);
        } catch (err: any) {
            console.error("Error posting item:", err.stack);
            return res.status(500).json({
                message: "Failed to post item",
                error: err.message,
            });
        }
    }
);

router.get("/items/:id/image", async (req, res) => {
    const { id } = req.params;
    const result = await pool.query(
        "SELECT img_data, img_mime FROM items WHERE id = $1",
        [id]
    );

    if (!result.rows.length || !result.rows[0].img_data) {
        return res.status(404).send("Image not found");
    }

    res.set("Content-Type", result.rows[0].img_mime || "application/octet-stream");
    res.send(result.rows[0].img_data);
});




// Get all items (marketplace)
router.get("/items", async (req: Request, res: Response) => {
    try {
        const items = await pool.query(
            `SELECT i.*, u.name AS owner_name
       FROM items i
       JOIN users u ON i.owner_id = u.id
       ORDER BY i.created_at DESC`
        );
        res.json(items.rows);
    } catch (err: any) {
        console.error("Error fetching items:", err.message);
        res.status(500).json({ message: "Failed to fetch items", error: err.message });
    }
});

// ======================= OFFERS =======================

// Make an offer
router.post("/items/:id/offers", protect, async (req: Request, res: Response) => {
    try {
        const { offer_price } = req.body;
        if (!offer_price) {
            return res.status(400).json({ message: "Offer price is required" });
        }

        const offer = await pool.query(
            `INSERT INTO offers (item_id, buyer_id, offer_price, status, created_at)
       VALUES ($1, $2, $3, 'pending', CURRENT_TIMESTAMP) RETURNING *`,
            [req.params.id, (req as any).user.id, offer_price]
        );

        res.json(offer.rows[0]);
    } catch (err: any) {
        console.error("Error inserting offer:", err.message);
        res.status(500).json({ message: "Failed to submit offer", error: err.message });
    }
});

// View offers for an item
router.get("/items/:id/offers", protect, async (req: Request, res: Response) => {
    try {
        const offers = await pool.query(
            `SELECT o.*, u.name AS buyer_name
       FROM offers o
       JOIN users u ON o.buyer_id = u.id
       WHERE o.item_id = $1
       ORDER BY o.created_at DESC`,
            [req.params.id]
        );
        res.json(offers.rows);
    } catch (err: any) {
        console.error("Error fetching offers:", err.message);
        res.status(500).json({ message: "Failed to fetch offers", error: err.message });
    }
});

// Delete an item
router.delete("/items/:id", protect, async (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;

        const itemResult = await pool.query(
            "SELECT * FROM items WHERE id = $1 AND owner_id = $2",
            [itemId, (req as any).user.id]
        );

        if (itemResult.rows.length === 0) {
            return res.status(404).json({ message: "Item not found or not authorized" });
        }

        const item = itemResult.rows[0];

        await pool.query("DELETE FROM items WHERE id = $1", [itemId]);

        if (item.img_url) {
            const imagePath = path.join(process.cwd(), item.img_url.replace("/uploads/", "uploads/"));
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error deleting image file:", err.message);
                else console.log("Image file deleted:", imagePath);
            });
        }

        res.json({ message: "Item and image deleted successfully" });
    } catch (err: any) {
        console.error("Error deleting item:", err.message);
        res.status(500).json({ message: "Failed to delete item", error: err.message });
    }
});

// Accept/Decline offer
router.put("/offers/:id/respond", protect, async (req: Request, res: Response) => {
    try {
        const { action } = req.body;

        const offer = await pool.query(
            `SELECT o.*, i.owner_id 
       FROM offers o
       JOIN items i ON o.item_id = i.id
       WHERE o.id = $1`,
            [req.params.id]
        );

        if (offer.rows.length === 0) {
            return res.status(404).json({ message: "Offer not found" });
        }

        if (offer.rows[0].owner_id !== (req as any).user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const status = action === "accept" ? "accepted" : "declined";
        await pool.query(`UPDATE offers SET status = $1 WHERE id = $2`, [status, req.params.id]);

        if (status === "accepted") {
            await pool.query(
                `UPDATE items 
         SET status = TRUE, current_price = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
                [offer.rows[0].offer_price, offer.rows[0].item_id]
            );
        }

        res.json({ message: `Offer ${status}` });
    } catch (err: any) {
        console.error("Error responding to offer:", err.message);
        res.status(500).json({ message: "Failed to respond to offer", error: err.message });
    }
});

// Get all offers made by the logged-in user
router.get("/my-offers", protect, async (req: Request, res: Response) => {
    try {
        const offers = await pool.query(
            `SELECT o.*, i.name AS item_name, u.name AS seller_name
       FROM offers o
       JOIN items i ON o.item_id = i.id
       JOIN users u ON i.owner_id = u.id
       WHERE o.buyer_id = $1
       ORDER BY o.created_at DESC`,
            [(req as any).user.id]
        );
        res.json(offers.rows);
    } catch (err: any) {
        console.error("Error fetching my offers:", err.message);
        res.status(500).json({ message: "Failed to fetch offers", error: err.message });
    }
});

// ======================= DASHBOARD =======================

// Dashboard: items + offers + profit
router.get("/dashboard", protect, async (req: Request, res: Response) => {
    try {
        const items = await pool.query(
            `SELECT i.*, 
              (SELECT COUNT(*) FROM offers o WHERE o.item_id = i.id) AS offer_count
       FROM items i
       WHERE i.owner_id = $1`,
            [(req as any).user.id]
        );

        const profit = await pool.query(
            `SELECT COALESCE(SUM(current_price),0) AS total_profit
       FROM items
       WHERE owner_id = $1 AND status = TRUE
         AND DATE(updated_at) = CURRENT_DATE`,
            [(req as any).user.id]
        );

        res.json({ items: items.rows, profit: profit.rows[0].total_profit });
    } catch (err: any) {
        console.error("Error fetching dashboard:", err.message);
        res.status(500).json({ message: "Failed to fetch dashboard", error: err.message });
    }
});

export default router;
