/* ------------------------------------------------------------------------------------------------
 * Copyright (c) mgm security partners GmbH. All rights reserved.
 * Licensed under the AGPLv3 License. See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------------*/

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const TestcaseSchema = new mongoose.Schema(
  {
    testNumber: { type: Number, unique: true },
    title: { type: String },
    description: { type: String },
    detailedDescription: { type: String },
    path: { type: String },
    date_created: { type: Date },
    tagNums: [{ type: Number }],
    question: { type: String },
    possibleAnswers: [
      {
        ans_id: { type: Number, default: 1 },
        ans_desc: { type: String },
      },
    ],
  },
  { timestamps: true },
  { toJSON: { virtuals: true } }
);

TestcaseSchema.index(
  {
    title: 'text',
    description: 'text',
  },
  {
    weights: {
      title: 3,
      description: 1,
    },
  }
);

// Enable "Tag" population
TestcaseSchema.virtual('tags', {
  ref: 'Tag',
  localField: 'tagNums',
  foreignField: 'tagNumber',
});
TestcaseSchema.set('toObject', { virtuals: true });
TestcaseSchema.set('toJSON', { virtuals: true });

TestcaseSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Testcase', TestcaseSchema);
