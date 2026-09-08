const express= require("express");
const app= express();
// Middleware to parse JSON body
app.use(express.json());

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

    app.post("/jobs",async(quries,responses)=>{
    const data=quries.headers;
    const props=quries.body;
    const types=props.type;
    const criteria=props.criteria;
    const label = props.label;
    responses.send(`Generate a list of ${types} based on the following criteria: \[Insert criteria, e.g., ${criteria}\]. Provide the output strictly in JSON format with no conversational text. Follow this schema for each item: { "title": ${label}, "description": "Short description", "link": "URL", "body": "Detailed ${types} content" }.`)
    try{
         
 
    const payload = {
      contents: [
        {
          parts: [{ text: `Generate a list of current job recruitments based on the following criteria: \[Insert criteria, e.g., location, industry\]. Provide the output strictly in JSON format with no conversational text. Follow this schema for each item: { "title": "Job Title", "description": "Short description", "link": "URL", "body": "Detailed job content" }.` }],
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