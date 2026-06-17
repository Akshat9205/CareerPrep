const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  moduleId:   { type: String, required: true, unique: true },
  description:{ type: String, default: '' },
  duration:   { type: String, default: '1 hour' },
  category:   { type: String, default: 'General' },
  type:       { type: String, default: 'basic' }, // 'basic' or company id
  published:  { type: Boolean, default: true },
  totalLessons:{ type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
