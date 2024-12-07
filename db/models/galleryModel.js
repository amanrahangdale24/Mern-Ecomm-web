const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema(
    { image: { type: String } },
    { timestamps: true } 
);

module.exports = mongoose.model('Gallery', gallerySchema); // is mongodb, this collection is converted into galleries. 
