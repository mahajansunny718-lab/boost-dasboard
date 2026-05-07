const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// 🔥 MongoDB connect (FIXED)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("BoostDB Connected"))
.catch(err => {
    console.log("MongoDB ERROR:", err); // 👈 important
});

// ✅ Schema
const UserSchema = new mongoose.Schema({
    phone: String,
    password: String
});

const BoostUser = mongoose.model("BoostUser", UserSchema);

// 🔥 LOGIN = CREATE + LOGIN
app.post("/login", async (req, res) => {
    try {
        const { phone, password } = req.body;

        // 🔴 EXTRA SAFETY (no logic change)
        if (!phone || !password) {
            return res.json({
                success: false,
                message: "Missing phone or password"
            });
        }

        let user = await BoostUser.findOne({ phone });

        if (!user) {
            user = new BoostUser({ phone, password });
            await user.save();

            return res.json({
                success: true,
                message: "Sell Boosted Successfully"
            });
        }

        if (user.password === password) {
            return res.json({
                success: true,
                message: "Sell Already Boosted"
            });
        } else {
            return res.json({
                success: false,
                message: "Wrong password"
            });
        }

    } catch (err) {
        console.log("LOGIN ERROR:", err); // 👈 VERY IMPORTANT

        return res.json({
            success: false,
            message: err.message // 👈 show real error
        });
    }
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Boost Server running on port ${PORT}`);
});