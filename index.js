const express= require("express");
const app= express();
const cors=require('cors')
// Middleware to parse JSON body
app.use(express.json());
app.use(cors({origin:"https://zerocorruptions.web.app/"}))
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));
app.get("/",async(quries,responses)=>{
    const data=quries.headers;
    const props=quries.query;
    const t=props.type
    try{
         
 
    const payload = {
      contents: [
        {
          parts: [{ text: props.text }],
        },
      ],
    };
      
          const fetchReq= await fetch(process.env.CUSTOMIZE_AI_API,{  method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
            const reqJson= await fetchReq.json();
            responses.send(reqJson);
}catch(error){
responses.send(error)
    }})

    app.post("/workflow",async(quries,responses)=>{
    const data=quries.headers;
    const props=quries.body;
    const types=props.type;
    const criteria=props.criteria;
    const label = props.label;
   const genProms=`Generate a list of ${types} based on the following criteria: \[Insert criteria, e.g., ${criteria}\]. Provide the output strictly in JSON format with no conversational text. Follow this schema for each item: { "title": ${label}, "description": "Short description", "link": "URL", "body": "Detailed ${types} content" }.`
    try{
         
 
    const payload = {
      contents: [
        {
          parts: [{ text:genProms }],
        },
      ],
    };
      
          const fetchReq= await fetch(process.env.CUSTOMIZE_AI_API,{  method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
            const reqJson= await fetchReq.json();
            responses.send(reqJson);
}catch(error){
responses.send(error)
    }})

app.listen(3050)