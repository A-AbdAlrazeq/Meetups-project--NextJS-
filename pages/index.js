import { MongoClient } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";
import MeetupList from "../components/meetups/MeetupList";
/* if we import something and it's used just in export async function getStaticProps or getServerSideProps =>the import package will not be of client side bundle
will be execute just on server  and next js will detect it and will not include it in client side which is good for bundle size consideration and for security
so you can import server side and client side depending where to use it while include in different bundle    */

function Homepage(props) {
  /* const [loadedMeetups, setLoadedMeetups] = useState([]);
  useEffect(() => {
    send a http request and fetch data
     we have two component render cycle,the first render will be the initial state (empty array),so we have problem with SEO,and in view source code the data missing
     the next js does not wait for second render cycle ,it will take the result from first render and return that as pre-render html code,so next js will not wait data to be fetch
     it's will return the result of first render cycle
     two form of pre-rendering:
    static generation:it's pre-render when developer build website for production(by run npm run build script),so if you update the data and page need to change,you need to start
    that's build process again
    server side rendering(ssr) 
    setLoadedMeetups(DUMMY_MEETUPS);
  }, []); if we want to send http req when page rendered we must use useEffect,empty array mean it's will run just first render */

  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups"
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}
//this function will run always on the server after deployment
/* export async function getServerSideProps(context) {
  //any code write here will run on server,never on client
  const req = context.req;
  const res = context.res;
  return {
    props: { meetups: DUMMY_MEETUPS },
    //revalidate: 10,not make sense to add it here,because function run for every incoming request
    //anyway,no need to revalidate it every x second
  };
} */

/* next js if find this function getStaticProps will execute it when pre-rendering process,first of all will execute this function before component func,
the job for this func is prepare props for this page and it's can be async func,will return promise so now we can load data before comp func execute ,the code in this func it's
just execute just in build process,so it will not run on client side */
export async function getStaticProps() {
  /* fetch data from API
  now no need for state and useEffect because we get the data through props,so now we can see the data inside view page source it's now contains full html code and now great 
  for SEO,now the data is not fetched in second pre-render cycle,before the page pre-render during the build process */
  /*this code only run on server side or during build time never in client, instead of create meetup file in api folder we can write the code here directly
  because this code run directly on server side never on client,we don't need to send unnecessary request to our api route
  
  this code only run just when page pre-generated not for every incoming request on build process or when revalidate the page*/
  const client = await MongoClient.connect(
    "mongodb+srv://Abood:Abood123ax@next-js.syz3y0l.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  //find by default will find all document in that collection,we use to array to get back array of doc
  const meetups = await meetupsCollection.find().toArray();
  client.close();
  return {
    //we must map ot because the id is complex object
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(), //here we convert the object to string to be usable
      })),
    },
    revalidate: 1,
    /*  when we add this property,we unlock features called incremental static generation,this number is the second that next js will wait 
    until regenerates page for incoming request,it's will generated every couple of seconds on the server,at least if there's request for this page,so it will replace the old
    pre-generated page,tha page will update after deployment but sometime update is not enough,you need to 
    re generate the page */
  };
}

/* getServerSideProps: might it's better to run for every request ,but it's disadvantage because you need
to wait your page to generate for every incoming request,if you don't have data change many time(every second) 
and you don't need to access request object (ex:for auth) use getStaticProps will be better.
 getStaticProps: pre-generate a html file can be stored and served by CDN and simply faster tha re-generating
 and fetching that data for every incoming request,so it will be faster because it can cached and reused instead
 of regenerated all the time,you don't have access to req and res in getStaticProps  */
export default Homepage;
