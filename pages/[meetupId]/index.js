import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
} /* if it dynamic page and we use getStaticProps we must export this func,
getStaticPaths allows you to control which pages are generated during the build instead of on-demand with fallback,will statically pre-render all the paths specified by getStaticPaths.  */
export async function getStaticPaths() {
  /* object have path key and it's array have multiple object and obj should have params key */
  const client = await MongoClient.connect(
    "mongodb+srv://Abood:Abood123ax@next-js.syz3y0l.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();
  //first empty object will give me all object,second arg will define which felid should be extract for every doc, _id: 1 =>this mean only include the id
  return {
    fallback: true,
    /* if it false,mean your path's contain all supported  meetupID=>that's mean if use enter something ex:m3=>will see 404 error,if it true next js will try to generate page
    for this meetup id dynamically on the server for incoming request,it's good features because it's allow us to pre-generate some of your pages for specific meetup id value
    (ex :page visit most frequently and pre generate the messing one dynamically when request for them are coming in) 
    true : new path will be statically generated (getStaticProps is called) - loading state is shown while generating page(via router.isFallback and showing fallback page) -
     page is rendered with required props after generating - 
     new path will be cached in CDN (later requests will result in cached page) - crawler Bots may index fallback page (not good for Seo) 
      true is useful if your app has a very large number of static pages that depend on data (such as a very large e-commerce site).
       If you want to pre-render all product pages, the builds would take a very long time. Instead, you may statically generate a small subset of pages and use fallback: 
       true for the rest.*/
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
    /*  [
      {
        params: {
          meetupId: "m1",
        },
      },
      {
        params: {
          meetupId: "m2",
        },
      },
    ], */
  };
}
/* next js need to pre-generate all version of this dynamic page for all supported ID,because it's dynamic,next js should know for which id value should be pre-generate the page
if we add id not found will see 404 error*/
export async function getStaticProps(context) {
  /*fetch data for a single meetup,we need way to identify that's meetup (ex:ID),the id is encoded in url
  so we can use Router hook to access router obj then use query property ,it's can use in component func 
  but it's not accessible inside getStaticProps.
   */
  /*that's object where out identifier between square bracts will be properties and the value
   will be the actual value encoded in url*/

  const meetupId = context.params.meetupId; //meetupId because that identifier i have between square bracts
  const client = await MongoClient.connect(
    "mongodb+srv://Abood:Abood123ax@next-js.syz3y0l.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  //find one single doc
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId), // this will convert the string id to object id
  });
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(), //we must convert the id to string to avoid the serialization error
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
        image: selectedMeetup.image,
      },
    },
  };
}

export default MeetupDetails;
