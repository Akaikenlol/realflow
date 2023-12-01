import { Schema, model, models, Document } from "mongoose";

export interface IAnswer extends Document {
	author: Schema.Types.ObjectId;
	question: Schema.Types.ObjectId;
	content: string;
	createdAt: Date;
	upvotes: Schema.Types.ObjectId[];
	downvotes: Schema.Types.ObjectId[];
}

const AnswerSchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
	question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Answer = models.Answer || model("Answer", AnswerSchema);

export default Answer;
