// api/new-meetup
/* the folder name should name api inside pages folder,it's not return html code but about accept incoming HTTP requests with JSON  data attached to them
Api routes allow you to build your own api endpoints,any file inside api will turn to api routes>>endpoints that targeted by requests and should receive json and return json
inside this file is server side code,api routes only run on server */
import { MongoClient } from "mongodb";
async function handler(req, res) {
  //now this func just accept post request
  if (req.method === "POST") {
    const data = req.body;
    console.log(data);
    /* const { title, image, address, description } = data; */
    //this code will never run on client side,this secure place to store credential
    const client = await MongoClient.connect(
      "mongodb+srv://Abood:Abood123ax@next-js.syz3y0l.mongodb.net/?retryWrites=true&w=majority"
    );
    const db = client.db();
    const meetupsCollection = db.collection("meetups");
    //in mongodb the document is an js object so we can pass object to collection,so no need to use destructuring
    const result = await meetupsCollection.insertOne(data);
    console.log(result);
    client.close();
    //this status method called on response to set a HTTP status code of the response which will return,201 to indicate that something was inserted successfully
    res.status(201).json({ message: "meetup inserted !" });
  }
}
export default handler;
