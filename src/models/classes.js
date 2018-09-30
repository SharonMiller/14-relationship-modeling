'use strict';

import mongoose from 'mongoose';

const classesSchema = mongoose.Schema({
  className: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'students' }],
});

classesSchema.pre('findOne', function (next) {
  this.populate('students');
  next();
});



export default mongoose.model('classes', classesSchema);
