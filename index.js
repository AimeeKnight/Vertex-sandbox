const {VertexAI} = require('@google-cloud/vertexai');

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({project: 'aimee-sandbox', location: 'us-east4'});
const model = 'gemini-1.0-pro-001';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generation_config: {
    "max_output_tokens": 2048,
    "temperature": 0.9,
    "top_p": 1
},
  safety_settings: [
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
],
});

async function generateContent() {
  const req = {
    contents: [{role: 'user', parts: [{text: "Question: What is the sentiment\nQuestion: For the given review,\nreturn a JSON object that has the\nfields sentiment and explanation.\nAcceptable values for sentiment\nare Positive or Negative. The\nexplanation field contains text\nthat explains the sentiment.\n\nReview: This is a shoe I will wear\nwith black dress pants or jeans\nwhen I need comfort and a little\nstyle, but I am not impressed.\nThis is a very flimsy shoe with\nlittle support at all. Unlike any\nother shoes I've purchased in the\npast. It looks nice, but it's not\ncomfortable."}]}],
  };

  const streamingResp = await generativeModel.generateContentStream(req);

  for await (const item of streamingResp.stream) {
    process.stdout.write('stream chunk: ' + JSON.stringify(item));
  }

  process.stdout.write('aggregated response: ' + JSON.stringify(await streamingResp.response));
};

generateContent();
