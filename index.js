const express = require("express");
const Tesseract = require("tesseract.js");
const app = express();
const multer = require("multer");
const cors = require("cors");
const {MongoClient}=require('mongodb')
app.use(express.json());
app.use(cors({ origin: "https://zerocorruptions.web.app" }));
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.post("/extracttext", upload.single("image"), async (req, res) => {
  
  try {
    // req.file.buffer contains the image data in memory
    const result = await Tesseract.recognize(req.file.buffer, "eng");
    res.json({ text: result.data.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function apiPath() {
const apis = [
  process.env.CUSTOMIZE_AI_API,
  process.env.CUSTOMIZE_AI_API_L1,
  process.env.CUSTOMIZE_AI_API_L2,
  process.env.CUSTOMIZE_AI_API_L3,
  process.env.CUSTOMIZE_AI_API_L4,
  process.env.CUSTOMIZE_AI_API_L5,
];

return apis[Math.floor(Math.random() * apis.length)];;
}

// async function module2_generater(prompt) {
//   const url = process.env.URL_M2;
//   const requiredData = process.env.M2_REQUIORED; // Store your key in env variable

//   const body = {
//     model: "openai/gpt-oss-20b",
//     input: prompt,
//   };

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${requiredData}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("Groq Response:", data);
//     return data;
//   } catch (error) {
//     console.error("Error fetching Groq response:", error);
//     throw error;
//   }
// }

async function post_mcq(params,trainerPath) {
 const response =await fetch(trainerPath,{method:"POST",headers:{'Content_Type':'application/json'},body:JSON.stringify(params)}) 
const result= await response.json();
return result;
}

async function module_Trainer(params,trainerPath) {
 const response =await fetch(trainerPath,{method:"POST",headers:{'Content_Type':'application/json'},body:JSON.stringify(params)}) 
const result= await response.json();
return result;
}
async function module_Trainer_Data() {
 const response =await fetch(process.env.TRAINER,{method:"GET",headers:{'Content_Type':'application/json'}}) 
const result= await response.json();
return result;
}
app.post('/trained_my_module',async(req,res)=>{
const traineddata=await module_Trainer(req.body,process.env.TRAINER);
res.send(traineddata)
})
app.post('/conversation',async(req,res)=>{
const traineddata=await module_Trainer(req.body,process.env.CONV);
res.send(traineddata)
})
app.post('/parsingfailed',async(req,res)=>{
const traineddata=await module_Trainer(req.body,process.env.PERSF);
res.send(traineddata)
})
app.post('/flowdata',async(req,res)=>{
const traineddata=await module_Trainer(req.body,process.env.WEBDATA);
res.send(traineddata)
})
app.post('/complaint_data',async(req,res)=>{
const traineddata=await module_Trainer(req.body,process.env.COMPL);
res.send(traineddata)
})
app.get('/trained_my_module',async ()=>{
const traineddata=await module_Trainer_Data();
res.send(traineddata)
})


const module1_generater=async(genProms)=>{
    try {
    const payload = {
      contents: [
        {
          parts: [{ text: genProms }],
        },
      ],
    };
    const pathRecog=apiPath();
    const fetchReq = await fetch(pathRecog, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const reqJson = await fetchReq.json();
    return reqJson;
  
  } catch (error) {
    return error;
  }

}
async function DataPush(requests,responses) {
  const URL=process.env.MONG
  const client = new MongoClient(URL);
await client.connect();
  const db = client.db("DataPoint"); // Database name
  const collection = db.collection("requestandresponses"); // Collection name

  const logEntry = {
    request: requests,
    response: responses,
    timestamp: new Date()
  };

  await collection.insertOne(logEntry);
  console.log("Data saved to requestandresponses!");
  await client.close();
}
app.post("/ai_trainer",(req,res)=>{
  const {requests,responses}=req.body;
  const ressender=DataPush(requests,responses);
  res.send(ressender);
})

// Middleware
// ✅ New endpoint: Read only count

app.get("/", async (quries, responses) => {
  const data = quries.headers;
  const props = quries.query;
  const t = props.type
  // const progress= await module1_generater(props.text);
  // responses.send(progress);
  responses.send("Test Mode, GET request not accepted and unauthorized access denied")
})

app.post("/workflow", async (quries, responses) => {
  const data = quries.headers;
  const props = quries.body;
  const types = props.type;
  const criteria = props.criteria;
  const label = props.label;

  const genProms = `Generate a list of ${types} based on the following criteria: \[Insert criteria, e.g., ${criteria}\]. Provide the output strictly in JSON format with no conversational text. Follow this schema for each item: { "title": ${label}, "description": "Short description", "link": "URL", "body": "Detailed ${types} content" }.${process.env.CUSTOMIZE_RES}`
 const progress=await module1_generater(genProms);
  responses.send(progress);
})

app.post("/question_and_answer", async (quries, responses) => {
  const data = quries.headers;
  const props = quries.body;
  const types = props.question;
  const last_Conversation = props.last
  const genProms = `Generate a answer based on the following question: \[ ${types} \] ${last_Conversation}. Provide the output strictly in JSON format with no conversational text. Follow this schema for each item: {  "answer": "answer only","isGet":"if answer not found then put false else true" }.if answer not found then put all details/problems to answer field ${process.env.CUSTOMIZE_RES}`
  const progress=await module1_generater(genProms);
  responses.send(progress);
})


app.post("/letter_writer", async (quries, responses) => {
  const data = quries.headers;
  const props = quries.body;
  const types = props.question;
  const last_Conversation = props.last
  const genProms = `Generate a purfect latter on the following criteria: \[ ${types} \]. Provide the output strictly in JSON format with no conversational text. Follow this schema for each item: {"answer": "" } write as reacjs format html with embedded css format use line break ,space every thing properlymast usabel for reactjs. ${process.env.CUSTOMIZE_RES}`
 const progress=await module1_generater(genProms);
  responses.send(progress);
})


app.post("/math_solution", async (quries, responses) => {
  const data = quries.headers;
  const criteria = quries.body;
  const genProms = `Generate a proper solution  of the question is \[ ${criteria.question} \] based on context. Provide the output strictly in JSON format with no conversational text. Follow this schema for each item: {"solution": "" } write in html with embedded css format with remark of every solution solution format must look like as hand written , if it is math question provide answer with comment to get understanding in concept . ${process.env.CUSTOMIZE_RES}`
   const progress=await module1_generater(genProms);
  responses.send(progress);
})


app.post("/mock_test", async (quries, responses) => {
  const data = quries.headers;
  const criteria = quries.body;
  const genProms = `Generate a mock question answers based on \[ ${criteria.request} \] subject. Provide the output strictly in JSON format with no conversational text. Follow this schema for each item: {categoty:"example math,english,science etc","question": "question","body": "only body if required else skip it", options:[1st option,2nd option,3rd option,4th option],answer:"correct answer" },generate 30questions. ${process.env.CUSTOMIZE_RES}`
   const progress=await module1_generater(genProms);
  const postMcq=await post_mcq(`${progress.env.MCQDATA}${criteria.EXAM}.json`,progress.candidates[0].content.parts[0].text);
  responses.send(postMcq);
})

app.post("/fromsubmission", async (quries, responses) => {
  const data = quries.headers;
  const criteria = quries.body;
  const genProms = `Generate a draft of complaint based on the following complain criteria: \[ ${criteria.complain} \]. Provide the output strictly in JSON format with no conversational text. Follow this schema for each item: {"comp_draft": "proper a complain letter dont use complainer name or phone or email , write mail as anonymous person","tegto": "find out some local authority mail id by using address of complainer and put here if unable to get the keep blank","isGet":"if answer not found then put false else true" }. ${process.env.CUSTOMIZE_RES}`
   const progress=await module1_generater(genProms);
  responses.send(progress);
})


app.listen(3050)