//our-domain.com/newMeetup
import NewMeetupForm from "../../components/meetups/NewMeetupForm";
import { useRouter } from "next/router";
import Head from "next/head";
import { Fragment } from "react";
function newMeetupPage() {
  const router = useRouter();
  async function addMeetupHandler(enteredMeetupData) {
    //here we send request on same server but deferent path,will send req to new-meetup file
    const response = await fetch("/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(enteredMeetupData),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    console.log(data);
    //we use router to redirect page to main page after insert successfully
    router.push("/");
  }
  return (
    <Fragment>
      <Head>
        <title>Add a New Meetup</title>
        <meta name="description" content="Add your own meetups" />
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </Fragment>
  );
}
export default newMeetupPage;
