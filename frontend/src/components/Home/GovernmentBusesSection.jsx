import GovernmentBusCard from "./GovernmentBusCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const busPartners = [
  {
    id: 1,
    name: "APSRTC",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzzNuuq-nzVWy0rcaJT2Bu8FezhvHrAV1d3FJQfWfrdDRqAoHNUp_DRcDmd6PvqPDauqkQZoGbggmDaXtXEA&s&ec=121630492",
    description: "Andhra Pradesh State Road Transport Corporation",
  },
  {
    id: 2,
    name: "TSRTC",
    logo: "https://upload.wikimedia.org/wikipedia/en/7/77/Telangana_State_Road_Transport_Corporation_logo.png",
    description: "Telangana State Road Transport Corporation",
  },
  {
    id: 3,
    name: "KSRTC",
    logo: "https://upload.wikimedia.org/wikipedia/en/7/71/Kerala_State_Road_Transport_Corporation_logo.png",
    description: "Karnataka State Road Transport Corporation",
  },
  {
    id: 4,
    name: "HRTC",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/HRTCHP.jpg/250px-HRTCHP.jpg",
    description: "Himachal Road Transport Corporation",
  },
  {
    id: 5,
    name: "haab Travels",
    logo: "https://img.freepik.com/premium-vector/round-blue-bus-sign-vector-illustration_213497-1718.jpg",
    description: "Popular private intercity bus operator",
  },
  {id: 4,
    name: "HRTC",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/HRTCHP.jpg/250px-HRTCHP.jpg",
    description: "Himachal Road Transport Corporation",
  }
];

export default function BusPartnersSection() {
  return (
    <section className="bg-slate-50 pt-4 pb-12 md:pt-6 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="mb-3 inline-block rounded-full bg-red-50 px-4 py-1 text-sm font-semibold text-red-500">
              Trusted Operators
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Bus Partners
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
              Travel with trusted state transport and top private bus operators
              across India.
            </p>
          </div>

          {/* Desktop Nav Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              className="custom-prev flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-400 hover:text-red-500 hover:shadow-md"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              className="custom-next flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-400 hover:text-red-500 hover:shadow-md"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: ".custom-prev",
              nextEl: ".custom-next",
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop={true}
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 1.2 },
              480: { slidesPerView: 1.5 },
              640: { slidesPerView: 2.2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            className="!pb-2"
          >
            {busPartners.map((bus) => (
              <SwiperSlide key={bus.id} className="h-auto">
                <GovernmentBusCard bus={bus} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Mobile Nav Buttons */}
          <div className="mt-6 flex items-center justify-center gap-3 md:hidden">
            <button
              className="custom-prev flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 shadow-sm transition hover:border-red-400 hover:text-red-500"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              className="custom-next flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 shadow-sm transition hover:border-red-400 hover:text-red-500"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}