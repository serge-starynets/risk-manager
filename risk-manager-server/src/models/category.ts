import mongoose, { Schema, model, Model } from 'mongoose';

export interface ICategory {
	name: string;
	description?: string;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICategoryDocument extends ICategory, mongoose.Document {
	_id: mongoose.Types.ObjectId;
}

const categorySchema = new Schema<ICategoryDocument>({
	name: { type: String, required: true },
	description: { type: String, required: false },
	createdBy: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const Category: Model<ICategoryDocument> =
	(mongoose.models.Category as Model<ICategoryDocument>) || model<ICategoryDocument>('Category', categorySchema);
