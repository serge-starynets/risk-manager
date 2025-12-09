import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const riskSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: false },
	categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
	resolved: { type: Boolean, default: false },
	createdBy: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const Risk = mongoose.models.Risk || model('Risk', riskSchema);
