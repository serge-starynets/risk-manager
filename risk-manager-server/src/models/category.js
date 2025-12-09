import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const categorySchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: false },
	createdBy: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const Category = mongoose.models.Category || model('Category', categorySchema);
