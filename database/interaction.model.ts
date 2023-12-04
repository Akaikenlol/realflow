import { Schema, model, models, Document } from "mongoose";

export interface IInteraction extends Document {
	user: Schema.Types.ObjectId;
	question: Schema.Types.ObjectId;
	answer: Schema.Types.ObjectId;
	tags: Schema.Types.ObjectId[];
	action: string;
	createdAt: Date;
}

const InteractionSchema = new Schema({
	user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	questions: { type: Schema.Types.ObjectId, ref: "Question" },
	answer: { type: Schema.Types.ObjectId, ref: "Answer" },
	tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
	action: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

const Interaction =
	models.Interaction || model("Interaction", InteractionSchema);

export default Interaction;
