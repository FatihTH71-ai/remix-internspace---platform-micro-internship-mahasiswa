import React, { FormEvent, useState } from "react";
import {
  ChevronDown,
  CircleHelp,
  CircleUserRound,
  Search,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

import heroImage from "../../assets/landing/asset-13.png";
import internspaceLogo from "../../assets/landing/internspace-logo.svg";
import panelImageOne from "../../assets/landing/raw-03.jpeg";
import panelImageTwo from "../../assets/landing/raw-07.jpeg";
import studentAvatar from "../../assets/landing/raw-02.jpeg";
import companyAvatar from "../../assets/landing/raw-04.jpeg";
import categoryDesign from "../../assets/landing/asset-18.svg";
import categoryTech from "../../assets/landing/asset-19.svg";
import categoryMarketing from "../../assets/landing/asset-20.svg";
import categoryEngineering from "../../assets/landing/asset-21.svg";
import categoryArrow from "../../assets/landing/asset-22.svg";
import quoteIcon from "../../assets/landing/asset-23.svg";
import verifiedIcon from "../../assets/landing/asset-24.svg";
import mentorshipIcon from "../../assets/landing/asset-25.svg";
import paymentIcon from "../../assets/landing/asset-26.svg";
import socialIconOne from "../../assets/landing/asset-27.svg";
import socialIconTwo from "../../assets/landing/asset-28.svg";
import socialIconThree from "../../assets/landing/asset-29.svg";

const categories = [
  { title: "Design", detail: "UI/UX, Branding, Visual", icon: categoryDesign },
  { title: "Tech", detail: "Web, App, Data Science", icon: categoryTech },
  { title: "Marketing", detail: "SEO, Social Media, Ads", icon: categoryMarketing },
  { title: "Engineering", detail: "Civil, Mechanical, IoT", icon: categoryEngineering },
];

const workflow = [
  {
    label: "for students",
    title: "Build professional profile",
    detail: "Make your skills and academic passion stand out to the professional world.",
  },
  {
    label: "for students",
    title: "Work & Get",
    detail: "Finish and clear the tasks, build your portfolio, and get professional experience.",
  },
  {
    label: "for companies",
    title: "Post your project",
    detail: "Identify specific project tasks that is need of fresh young talents.",
  },
  {
    label: "for companies",
    title: "Finish your work",
    detail: "Obtain the quality results while realizing future talents.",
  },
  {
    label: "for students",
    title: "Choosing a micro-internship project",
    detail: "Find your suitable short-term, micro-internship project (4–6 weeks).",
  },
  {
    label: "for companies",
    title: "Automated candidate review",
    detail: "Our system will your projects with the skillful student.",
  },
];

const benefits = [
  {
    title: "Verified Companies",
    detail: "We partner only with verified, reputable organizations to ensure safe and valuable internship experiences.",
    icon: verifiedIcon,
  },
  {
    title: "Mentorship Integration",
    detail: "Every project comes with direct mentorship from industry professionals to guide your learning process.",
    icon: mentorshipIcon,
  },
  {
    title: "Fast-Track Payments",
    detail: "Enjoy secure, automated payments released quickly upon successful completion of your micro-internships.",
    icon: paymentIcon,
  },
];

export const LandingPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentView("projects_list");
  };

  return (
    <div className="landing-page min-h-screen bg-white text-[#1a1c1e]">
      <header className="landing-nav">
        <button className="landing-logo" onClick={() => setCurrentView("landing")} type="button">
          <img alt="internspace" className="landing-logo-image" src={internspaceLogo} />
        </button>

        <button className="landing-explore" type="button">
          Explore
          <ChevronDown size={18} />
        </button>

        <form className="landing-search" onSubmit={handleSearch}>
          <input
            aria-label="Search projects, keywords, or companies"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search projects, keywords, or companies"
            value={searchTerm}
          />
          <button aria-label="Search" type="submit">
            <Search size={25} />
          </button>
        </form>

        <button className="landing-sign-in" onClick={() => setCurrentView("login")} type="button">
          Sign in
        </button>
      </header>

      <main>
        <section className="landing-hero">
          <img alt="" className="landing-hero-image" src={heroImage} />
          <div className="landing-hero-overlay" />
          <div className="landing-hero-content">
            <h1>
              Start &amp; earn
              <span>real-work experience here</span>
            </h1>
            <p>
              Discover micro-internship projects matched to your skills, interests, and class
              schedule with no long-term commitment required.
            </p>
          </div>
        </section>

        <section className="landing-image-pair">
          <img alt="Students collaborating on a project" src={panelImageOne} />
          <img alt="Students celebrating a completed project" src={panelImageTwo} />
        </section>

        <section className="landing-stats">
          {[
            ["30+", "Active projects"],
            ["1k+", "Achieving students"],
            ["10+", "Corporate partners"],
          ].map(([value, label]) => (
            <div className="landing-stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>

        <section className="landing-workflow landing-section" id="brief-dive">
          <div className="landing-section-heading">
            <h2>A brief dive</h2>
            <p>How internspace works?</p>
          </div>

          <div className="landing-workflow-labels">
            <span>for students</span>
            <span>for companies</span>
          </div>

          <div className="landing-workflow-grid">
            {workflow.map((item, index) => (
              <article className="landing-workflow-card" key={`${item.title}-${index}`}>
                <div className="landing-workflow-icon">
                  {index % 2 === 0 ? <CircleUserRound size={15} /> : <CircleHelp size={15} />}
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-categories landing-section" id="featured-categories">
          <div className="landing-section-heading">
            <h2>Featured Categories</h2>
            <p>Jelajahi berbagai bidang yang sesuai dengan passion Anda.</p>
          </div>
          <div className="landing-category-grid">
            {categories.map((category) => (
              <button
                className="landing-category-card"
                key={category.title}
                onClick={() => setCurrentView("projects_list")}
                type="button"
              >
                <span className="landing-category-icon">
                  <img alt="" src={category.icon} />
                </span>
                <strong>{category.title}</strong>
                <span>{category.detail}</span>
              </button>
            ))}
          </div>
          <button className="landing-text-link" onClick={() => setCurrentView("projects_list")} type="button">
            Lihat Semua
            <img alt="" src={categoryArrow} />
          </button>
        </section>

        <section className="landing-testimonials landing-section" id="testimonials">
          <div className="landing-section-heading">
            <h2>What were their words?</h2>
          </div>
          <div className="landing-testimonial-grid">
            <article className="landing-testimonial-card">
              <img alt="" className="landing-quote" src={quoteIcon} />
              <p>
                “Internspace gave me the opportunity to work on real projects at GoTo while
                staying focused on my thesis. My portfolio has improved dramatically!”
              </p>
              <div className="landing-person">
                <img alt="Fatih Alfaluza" src={studentAvatar} />
                <div>
                  <strong>Fatih Alfaluza</strong>
                  <span>Digital Business Student, International Logistics and Business Baccalaureate (ULBI)</span>
                </div>
              </div>
            </article>
            <article className="landing-testimonial-card">
              <img alt="" className="landing-quote" src={quoteIcon} />
              <p>
                “Finding talented individuals for our market research has become much easier and
                more cost-effective. The students on this platform are very professional.”
              </p>
              <div className="landing-person">
                <img alt="Anisa Aulia Rita Putri" src={companyAvatar} />
                <div>
                  <strong>Anisa Aulia Rita Putri</strong>
                  <span>Head of Research &amp; Development, FinTech XYZ</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="landing-benefits landing-section" id="why-internspace">
          <div className="landing-section-heading">
            <h2>Why choose internspace?</h2>
          </div>
          <div className="landing-benefit-grid">
            {benefits.map((benefit) => (
              <article className="landing-benefit-card" key={benefit.title}>
                <span className="landing-benefit-icon">
                  <img alt="" src={benefit.icon} />
                </span>
                <h3>{benefit.title}</h3>
                <p>{benefit.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-main">
          <div>
            <strong>internspace</strong>
            <p>Micro-internship that connects fully-potential students with true company projects</p>
          </div>
          <nav>
            <a href="#brief-dive">About us</a>
            <a href="#featured-categories">Categories</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#why-internspace">Details</a>
          </nav>
        </div>
        <div className="landing-footer-bottom">
          <span>© 2024 internspace. Bridging academia and execution.</span>
          <div>
            <button aria-label="Social link" type="button"><img alt="" src={socialIconOne} /></button>
            <button aria-label="Social link" type="button"><img alt="" src={socialIconTwo} /></button>
            <button aria-label="Social link" type="button"><img alt="" src={socialIconThree} /></button>
          </div>
        </div>
      </footer>
    </div>
  );
};
