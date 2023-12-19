import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
	const { question } = await request.json();

	try {
		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [
					{
						role: "system",
						content:
							"You are a knowledgeable assistant that provide quality information.",
					},
					{
						role: "user",
						content: `Tell me about ${question}`,
					},
				],
			}),
		});

		const responseData = await response.json();
		const reply = responseData.choices[0].message.content;
		console.log(responseData);
		// let reply;
		// if (responseData.choices && responseData.choices.length > 0) {
		// 	const reply = responseData.choices[0].message.content;
		// 	console.log("reply", reply);
		// 	return NextResponse.json({ reply });
		// } else {
		// 	// Handle the case where responseData.choices is undefined or empty
		// 	reply = "No valid response choices received from the server.";
		// }
		return NextResponse.json({ reply });
	} catch (error: any) {
		return NextResponse.json({ error: error.message });
	}
};
