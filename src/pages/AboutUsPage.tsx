import chairs from "@/assets/chairs.jpg";

export default function AboutUsPage() {
  return (
    <div className="w-full grow bg-pricing-page-background overflow-x-hidden">
      <div className="mx-auto w-full max-w-360 px-4 pt-14 md:px-8 md:pt-18 lg:px-23 lg:pt-20">
        <div className="text-center lg:pl-106 lg:text-left">
          <h1 className="text-[40px] leading-12 font-bold tracking-[-0.01em] text-pricing-heading-text md:text-[52px] md:leading-15.5 lg:text-[64px] lg:leading-19">
            About Us
          </h1>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[197px_832px] lg:gap-56.75">
          <div className="text-center lg:text-left">
            <p className="text-[24px] leading-8 font-bold tracking-[-0.0015em] text-pricing-heading-text">
              About Our Dream.
            </p>
            <p className="text-[24px] leading-8 font-bold tracking-[-0.0015em] text-pricing-heading-text">
              Our History.
            </p>
            <p className="text-[24px] leading-8 font-bold tracking-[-0.0015em] text-pricing-heading-text">
              Cinema.
            </p>
          </div>

          <div>
            <p className="text-body-md font-normal text-pricing-description-text">
              Welcome to Cinebh, where movie magic comes to life.
              <br />
              At Cinebh, we're not just about screening films; we're passionate
              about creating unforgettable cinematic experiences. Since our
              establishment, we've been dedicated to providing our audience with
              top-quality entertainment in a comfortable and welcoming
              environment.
              <br />
              Our state-of-the-art facilities boast the latest in audiovisual
              technology, ensuring that every movie is presented with stunning
              clarity and immersive sound. From the latest blockbusters to
              timeless classics, our diverse selection of films caters to every
              taste and preference.
              <br />
              <br />
              As a hub for community entertainment, we take pride in being more
              than just a cinema.
              <br />
              Join us at Cinebh and discover why we're not just your average
              movie theater—we're your destination for cinematic excellence and
              entertainment bliss.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 w-full">
        <img
          src={chairs}
          alt="Cinema chairs"
          className="h-113 w-full object-cover"
        />
      </div>
    </div>
  );
}
