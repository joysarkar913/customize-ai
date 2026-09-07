const express= require("express");
const app= express();
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
      
          const fetchReq= await fetch(`process.env.CUSTOMIZE_AI_API`,{  method: 'POST',
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