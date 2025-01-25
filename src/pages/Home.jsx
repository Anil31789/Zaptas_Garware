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

export default function Home() {
  return (
    <div>
      <Banner />

      <div className="container-fluid p-4">
        <div className="row d-flex">
          <div className="col-md-4 d-flex">
            <LinkedInCard />
          </div>
          <div className="col-md-4 d-flex ">
          <ManagementMessageCard />
           
          </div>
          <div className="col-md-4 d-flex">
          <AnnouncementCard />
            {/* <AwardsCard /> */}
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
        </div>
        <div className="birthday-wish">
          <BirthdayBox />
        </div>
        <div className="birthday-wish">
          {/* <WorkAnniversary /> */}
        </div>
        <div className="birthday-wish">
          <NewJoiners />
        </div>
      </div>
    </div>
  );
}
