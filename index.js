const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
const path = require("path");

const { MongoClient } = require("mongodb");
const fetch = require("node-fetch");
app.use(express.json());
app.use(cors({ origin: "https://zerocorruptions.web.app" }));
app.use(express.urlencoded({ extended: true }));
const uri = process.env.MONG;
const client = new MongoClient(uri);

async function storeResponse(userRequest, aiResponse) {
  await client.connect();
  const db = client.db("DataPoint"); // Database name
  const collection = db.collection("requestandresponses"); // Collection name

  const logEntry = {
    request: userRequest,
    response: aiResponse,
    timestamp: new Date()
  };

  await collection.insertOne(logEntry);
  console.log("Data saved for trained new module you can make request for delete this data");
  await client.close();
}

app.post('/train_data',(req,res)=>{
  const {request,response}=req;
  const responseSend=storeResponse(request,response)
  res.send(responseSend)
})

const filePath = path.join(__dirname, "data.json");

// Increment count with date reset
function incrementCount() {
  const date = new Date();
  const dateSet = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  const fileContent = fs.readFileSync(filePath, "utf-8");
  let data = JSON.parse(fileContent);

  if (data.date === dateSet) {
    data.count = (data.count || 0) + 1;
  } else {
    data.count = 0;
    data.date = dateSet;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return "done"
}

// Select API path based on count thresholds
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

// Middleware

app.get("/increase", (req, res) => {
const resp=incrementCount();
res.send(resp)
});
// ✅ New endpoint: Read only count
app.get("/count", (req, res) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    res.json({ count: data.count || 0 });
  } catch (error) {
    res.status(500).json({ error: "Unable to read count" });
  }
});
app.get("/", async (quries, responses) => {
  const data = quries.headers;
  const props = quries.query;
  const t = props.type
     fs.writeFileSync("data.json", JSON.stringify({"total":100,"name":"joy"}, null, 2));
  try {


    const payload = {
      contents: [
        {
          parts: [{ text: props.text }],
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
    
    responses.send(reqJson);
  } catch (error) {
    responses.send(error)
  }
})

app.post("/workflow", async (quries, responses) => {
  const data = quries.headers;
  const props = quries.body;
  const types = props.type;
  const criteria = props.criteria;
  const label = props.label;
 
  const genProms = `Generate a list of ${types} based on the following criteria: \[Insert criteria, e.g., ${criteria}\]. Provide the output strictly in JSON format with no conversational text. Follow this schema for each item: { "title": ${label}, "description": "Short description", "link": "URL", "body": "Detailed ${types} content" }.${process.env.CUSTOMIZE_RES}`
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
      
    responses.send(reqJson);
  } catch (error) {
    responses.send(error)
  }
})

app.post("/question_and_answer", async (quries, responses) => {
  const data = quries.headers;
  const props = quries.body;
  const types = props.question;
  const last_Conversation = props.last
  const genProms = `Generate a answer based on the following question: \[ ${types} \] ${last_Conversation}. Provide the output strictly in JSON format with no conversational text. Follow this schema for each item: {  "answer": "answer only","isGet":"if answer not found then put false else true" }.if answer not found then put all details/problems to answer field ${process.env.CUSTOMIZE_RES}`
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
      
    responses.send(reqJson);
  } catch (error) {
    responses.send(error)
  }
})


app.post("/letter_writer", async (quries, responses) => {
  const data = quries.headers;
  const props = quries.body;
  const types = props.question;
  const last_Conversation = props.last
  const genProms = `Generate a purfect latter on the following criteria: \[ ${types} \]. Provide the output strictly in JSON format with no conversational text. Follow this schema for each item: {"answer": "" } write as reacjs format html with embedded css format use line break ,space every thing properlymast usabel for reactjs. ${process.env.CUSTOMIZE_RES}`


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
    responses.send(reqJson);
  } catch (error) {
    responses.send(error)
  }
})




app.post("/fromsubmission", async (quries, responses) => {
  const data = quries.headers;
  const criteria = quries.body;
  const genProms = `Generate a draft of complaint based on the following complain criteria: \[ ${criteria.complain} \]. Provide the output strictly in JSON format with no conversational text. Follow this schema for each item: {"comp_draft": "proper a complain letter dont use complainer name or phone or email , write mail as anonymous person","tegto": "find out some local authority mail id by using address of complainer and put here if unable to get the keep blank","isGet":"if answer not found then put false else true" }. ${process.env.CUSTOMIZE_RES}`
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
    responses.send(reqJson);
  } catch (error) {
    responses.send(error)
  }
})


app.listen(3050)