require('dotenv').config(); // Load .env variables FIRST

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const multer = require('multer');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Mongoose Models
const CarouselImage = require('./models/carousel_images');
const MidbodyImage = require('./models/midbody_image');
const GridImageSection = require('./models/grid_image_model');
const BodyText = require('./models/BodyTextSchema');

// ✅ TEST the env is working
console.log("\u{1F310} Loaded MONGO_URI:", process.env.MONGO_URI || 3000);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MONGO CONNECTION OPEN TO hoffmans_reptile_store"))
.catch(err => console.log("❌ MONGO CONNECTION ERROR:", err));

app.set('views', path.join(__dirname, 'views', 'Page_One'));
app.set('view engine', 'ejs');

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Multer Setup
const upload = multer({ dest: 'uploads/' });

/* ---------- ROUTES ---------- */

app.get('/', async (req, res) => {
    try {
        const images = await CarouselImage.find({});
        const midbodyContent = await MidbodyImage.findOne({}).sort({ _id: -1 });
        const gridSections = await GridImageSection.find({}).sort({ _id: 1 });
        const bodyTextDoc = await BodyText.findOne({}).sort({ _id: -1 });

        const title = bodyTextDoc?.heading || "Welcome to Hoffmann's Reptile Shop";
        const description = bodyTextDoc?.subtext || "We specialize in exotic reptiles, expert advice, and all your reptile supply needs.";

        res.render('index', { images, midbodyContent, gridSections, title, description });
    } catch (err) {
        console.error("❌ Error rendering home page:", err);
        res.status(500).send("Server error loading homepage.");
    }
});

app.get('/body-introduction', async (req, res) => {
    try {
        const sections = await BodyText.find({});
        res.render('BodyIntroductionSection', { sections });
    } catch (err) {
        console.error("❌ Error loading body introduction sections:", err);
        res.status(500).send("Error loading introduction sections");
    }
});

app.post('/body-introduction', async (req, res) => {
    const { title, description } = req.body;
    const newText = new BodyText({ heading: title, subtext: description });
    await newText.save();
    res.redirect('/body-introduction');
});

app.put('/body-introduction/:id', async (req, res) => {
    const { id } = req.params;
    const { heading, subtext } = req.body;
    try {
        await BodyText.findByIdAndUpdate(id, { heading, subtext });
        res.redirect('/body-introduction');
    } catch (err) {
        console.error("❌ Error updating section:", err);
        res.status(500).send("Failed to update section.");
    }
});

app.get('/midbody/new', (req, res) => {
    res.render('MidbodyNewForm');
});

app.get('/grid/new', (req, res) => {
    res.render('GridImageNewForm');
});

app.get('/grid/edit', async (req, res) => {
    try {
        const gridSections = await GridImageSection.find({}).sort({ _id: 1 });
        res.render('GridImageEditForm', { gridSections });
    } catch (err) {
        console.error("❌ Failed to load grid sections:", err);
        res.status(500).send("Error loading grid data");
    }
});

app.post('/midbody', upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    const image = '/uploads/' + req.file.filename;
    await MidbodyImage.create({ title, description, image });
    res.redirect('/');
});

app.post('/grid', upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    const image = '/uploads/' + req.file.filename;
    await GridImageSection.create({ title, description, image });
    res.redirect('/');
});

app.post('/grid/update/:index', upload.single('image'), async (req, res) => {
    const { index } = req.params;
    const { title, description } = req.body;
    try {
        const gridSections = await GridImageSection.find({}).sort({ _id: 1 });
        const section = gridSections[index];
        if (!section) return res.status(404).send("Grid section not found");

        section.title = title;
        section.description = description;
        if (req.file) section.image = '/uploads/' + req.file.filename;

        await section.save();
        res.redirect('/grid/edit');
    } catch (err) {
        console.error("❌ Error updating grid section:", err);
        res.status(500).send("Error updating grid section");
    }
});

app.post('/send-message', async (req, res) => {
    const { name, email, message } = req.body;
    const logoURL = "https://i.postimg.cc/SN6WFz6f/Logo.png";
    const directionsURL = "https://www.google.com/maps?q=2359+Concord+Blvd,+Concord,+CA+94520";

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hudsonriver4151@gmail.com',
            pass: 'nrau proe pfuy ltvu'
        }
    });

    const mailToUser = {
        from: "\"Hoffmann's Reptile\" <hudsonriver4151@gmail.com>",
        to: email,
        subject: `Thanks for contacting Hoffmann's Reptile!`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <img src="${logoURL}" alt="Hoffmann's Reptile" style="width: 150px; height: auto; margin-bottom: 20px;" />
              <h2 style="color: #2e7d32;">Thank you for reaching out!</h2>
              <p>Hi ${name},</p>
              <p>We’ve received your message and will get back to you as soon as possible.</p>
              <h4>📍 Address:</h4><p>2359 Concord Blvd, Concord, CA 94520</p>
              <h4>☎️ Phone:</h4><p>(925) 671-9106</p>
              <h4>🕒 Store Hours:</h4>
              <ul style="line-height: 1.6;">
                <li>Thursday: 12–6:30 PM</li>
                <li>Friday: 12–6:30 PM</li>
                <li>Saturday: 10 AM–5 PM</li>
                <li>Sunday: Closed</li>
                <li>Monday: 12–6:30 PM</li>
                <li>Tuesday: 12–6:30 PM</li>
                <li>Wednesday: 12–6:30 PM</li>
              </ul>
              <a href="${directionsURL}" target="_blank" style="display: inline-block; margin-top: 20px; background-color: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">DIRECTIONS</a>
              <p style="margin-top: 30px;">We appreciate your interest in Hoffmann’s Reptile and look forward to helping you.</p>
              <p>— The Hoffmann's Reptile Team 🐍</p>
            </div>`
    };

    const mailToOwner = {
        from: email,
        to: 'hudsonriver4151@gmail.com',
        subject: `🐍 New Contact Submission from ${name}`,
        replyTo: email,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>New Contact Form Message</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p style="border: 1px solid #ccc; padding: 10px; background: #f9f9f9;">${message}</p>
            </div>`
    };

    try {
        await transporter.sendMail(mailToUser);
        await transporter.sendMail(mailToOwner);
        res.redirect('/confirmation');
    } catch (error) {
        console.error("Failed to send email:", error);
        res.status(500).send("Failed to send email.");
    }
});

app.get('/confirmation', (req, res) => {
    res.render('confirmation');
});

app.listen(3000, () => {
    console.log("🚀 APP IS LISTENING ON PORT 3000!");
});
