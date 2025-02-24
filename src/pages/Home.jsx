import AnnouncementCard from "../components/UI/AnnouncementCard ";
import AwardsCard from "../components/UI/AwardsCard";
import Banner from "../components/UI/Banner";
import BirthdayBox from "../components/UI/BirthdayBox";
import CalendarCard from "../components/UI/CalendarCard";
import CsrActivityCard from "../components/UI/CsrActivityCard";
import GalleryCard from "../components/UI/GalleryCard";
import IndustryCard from "../components/UI/IndustryCard";
import ITRequest from "../components/UI/ITRequest";
import LinkedInCard from "../components/UI/LinkedInCard";
import ManagementMessageCard from "../components/UI/ManagementMessageCard";
import NewJoiners from "../components/UI/NewJoiners";
import WorkAnniversary from "../components/UI/WorkAnniversary";
import QuickLink from "../components/UI/Quicklink"; // Import the QuickLink component
import HR from "../components/UI/HR";
import IT from "../components/UI/IT";
import Accounts from "../components/UI/Account";

export default function Home() {
  return (
    <div>
      <Banner />

      <div className="container-fluid p-4">
        <div className="row d-flex">
          <div className="col-md-4 d-flex">
            <LinkedInCard />
          </div>
          <div className="col-md-4 d-flex">
            <ManagementMessageCard />
          </div>
          <div className="col-md-4 d-flex">
            <AnnouncementCard />
          </div>
          <div className="col-md-4 d-flex">
            <CalendarCard />
          </div>
          <div className="col-md-4 d-flex">
            <IndustryCard />
          </div>
          <div className="col-md-4 d-flex">
            <CsrActivityCard />
          </div>
          <div className="col-md-4 d-flex">
            <GalleryCard />
          </div>
          <div className="col-md-4 d-flex">
            <ITRequest />
          </div>
          <div className="col-md-4 d-flex">
            <AwardsCard />
          </div>
          <div className="col-md-4 d-flex">
            <BirthdayBox />
          </div>
          <div className="col-md-4 d-flex">
            <WorkAnniversary />
          </div>
          <div className="col-md-4 d-flex">
            <NewJoiners />
          </div>
          <div className="col-md-4 d-flex mt-4">
            <HR />
          </div>
          <div className="col-md-4 d-flex mt-4">
            <IT />
          </div>
          <div className="col-md-4 d-flex mt-4">
            <Accounts />
            </div>

          
        </div>

        {/* <div className="birthday-wish">
          <QuickLink />
        </div> */}
        <div className="container-fluid p-4">
        <div className="row d-flex">
             {/* New Components */}
          
          </div>
        </div>
        
      </div>
    </div>
  );
}

