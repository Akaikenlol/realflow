import { Schema, model, models, Document } from "mongoose";

export interface IQuestion extends Document {
	title: string;
	content: string;
	views: number;
	createdAt: Date;
	tags: Schema.Types.ObjectId[];
	upvotes: Schema.Types.ObjectId[];
	downvotes: Schema.Types.ObjectId[];
	answers: Schema.Types.ObjectId[];
	author: Schema.Types.ObjectId;
}

const QuestionSchema = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	views: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now },
	tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
	upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	answer: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
	author: { type: Schema.Types.ObjectId, ref: "User" },
});

const Question = models.Question || model("Question", QuestionSchema);

export default Question;
