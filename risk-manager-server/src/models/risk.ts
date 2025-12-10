import mongoose, { Schema, model, Model } from 'mongoose';

export interface IRisk {
	name: string;
	description?: string;
	categoryId: mongoose.Types.ObjectId;
	resolved: boolean;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface IRiskDocument extends IRisk, mongoose.Document {
	_id: mongoose.Types.ObjectId;
}

const riskSchema = new Schema<IRiskDocument>({
	name: {
		type: String,
		required: [true, 'Name is required'],
		minlength: [3, 'Name must be at least 2 characters'],
		maxlength: [100, 'Name cannot exceed 100 characters']
	},
	description: {
		type: String,
		required: false,
		maxlength: [500, 'Description too long']
	},
	categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
	resolved: { type: Boolean, default: false },
	createdBy: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const Risk: Model<IRiskDocument> = (mongoose.models.Risk as Model<IRiskDocument>) || model<IRiskDocument>('Risk', riskSchema);
