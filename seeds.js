// seedIntroSections.js (run this once)
const mongoose = require('mongoose');
const IntroSection = require('./models/BodyTextSchema'); // or IntroSection.js

mongoose.connect('mongodb+srv://root:EILgtgj19s968uOL@cluster0.mmhyyv3.mongodb.net/hoffmans_reptile_store?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MONGO CONNECTION OPEN TO hoffmans_reptile_store"))
.catch(err => console.log("❌ MONGO CONNECTION ERROR:", err));

const data = [
  {
    sectionId: 'A',
    heading: 'SNAKES',
    subtext: "From ball pythons to rare cobras, Hoffman's Reptile Shop works with trusted breeders...",
    position: 1
  },
  {
    sectionId: 'B',
    heading: "Welcome to Hoffman's Reptile Shop",
    subtext: "Discover an incredible selection of exotic reptiles...",
    position: 2
  },
  {
    sectionId: 'C',
    heading: "Hoffman's Reptile Shop",
    subtext: "\"At Hoffman's Reptile Shop, we treat every cold-blooded critter like family...\"",
    position: 3
  }
];

IntroSection.insertMany(data)
  .then(() => {
    console.log("Sections seeded.");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
  });
