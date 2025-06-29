import { useState, type ReactElement } from 'react';
import Header, { type HeaderProps } from '../Header/Header';
import './about.scss';
import Footer from '../Footer/Footer';
import { ReactComponent as Branch } from './../../assets/About/branch 1.svg';
import { ReactComponent as Plant } from './../../assets/About/plant-image.svg';
import { ReactComponent as Branch2 } from './../../assets/Main/branch.svg';
import { ReactComponent as Arrow } from './../../assets/About/down.svg';
import { ReactComponent as Branch3 } from './../../assets/About/branch 3.svg';
import { ReactComponent as List } from './../../assets/About/list-icon.svg';
import { ReactComponent as Girl } from './../../assets/About/smiling-girl.svg';
import { ReactComponent as Team } from './../../assets/About/hands-together.svg';

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo: string;
  github: string;
  contributions: string;
};
type Question = {
  question: string;
  answer: string[];
};

export type AboutProps = HeaderProps & {};

const team: TeamMember[] = [
  {
    name: 'Dzmitryj Saldacenka',
    role: 'Team Lead/Frontend Developer',
    bio: `I'm 23. A logistician by degree, a programmer by passion.I love music, fishing, and football. And I love making people laugh and lifting their mood.`,
    photo: '../assets/photos/dima.jpg',
    github: 'https://github.com/Dimonchik2525',
    contributions: `Set up the repository, catalog page, main page.`,
  },
  {
    name: 'Polina Romanchuk',
    role: 'Frontend Developer/CommerceTools',
    bio: `I'm 25. I used to work as a lawyer, but over time I realized that programming 
      feels much closer to me. I love discovering new things, laughing, cats, nature, mountains, seas, and traveling.`,
    photo: '../assets/photos/polina.jpg',
    github: 'https://github.com/PolinaRomanchuk',
    contributions: `Set up the CommerceTools, authentication, authorization, detailed product page, cart.`,
  },
  {
    name: 'Artsiom Luksha',
    role: 'Frontend Developer/Scrum Master',
    bio: `I’m 31. I hold a bachelor’s in economics and law from Yanka Kupala State University.  
    Outside of coding, I train at the gym, cycle, explore museums, and read or watch films to broaden my horizons.`,
    photo: '../assets/photos/artem.jpg',
    github: 'https://github.com/AirDrop94',
    contributions: `Registration page, user profile page, about us page`,
  },
];

const questions: Question[] = [
  {
    question: 'What We Did?',
    answer: [
      `This was the final project of the Rolling Scopes School course — a team-based development of 
      a single-page eCommerce application built on top of the commercetools platform. 
      Our goal was to build a modern, user-friendly, and stable web application with full eCommerce 
      functionality, using the commercetools API and best practices of team collaboration.`,
      `The initial concept was a clothing store, but after the course ended, I decided to continue 
      the development independently and completely changed the direction.Today, the project has evolved 
      into FloralMuse — a modern online store for flowers and plants.`,
    ],
  },
  {
    question: 'How We Worked?',
    answer: [
      `•	Team of 3 developers`,
      `•	Followed the Git flow: each feature was developed in a separate branch with pull requests and code reviews`,
      `•	Used Jira for task management and sprint planning`,
      `•	Communication through Discord, with regular meetings at least twice a week`,
      `•	Tasks were organized into 2-week sprints`,
    ],
  },
  {
    question: `Key Objectives`,
    answer: [
      `•	Integration with commercetools (headless eCommerce platform)`,
      `•	Development of a fully functional SPA using React, TypeScript, and Webpack`,
      `•	Implementation of key features:`,
      `o	Product catalog with filtering, sorting, and category pages`,
      `o	Product detail page with full info and "add to cart" functionality`,
      `o	Shopping cart with price calculation, promo codes, quantity editing, and item removal`,
      `o	Authorization: login and registration`,
      `o	User profile with editable personal data, delivery addresses, and password management`,
      `o	"About the Team" page to showcase collaboration`,
      `•	Working with external data (products, categories) via REST API`,
      `•	Responsive design, UI animations, and improved UX details`,
    ],
  },
  {
    question: 'Technologies Used',
    answer: [
      `•	React, TypeScript`,
      `•	Scss for styling`,
      `•	Formik and Yup for forms and validation`,
      `•	Swiper for animations and sliders`,
      `•	Jest for testing`,
      `•	Husky, ESLint, Prettier for code quality and consistency`,
    ],
  },
  {
    question: `Final Result`,
    answer: [
      `•	A fully working SPA with a clean and intuitive UI, mobile responsiveness, and scalable architecture`,
      `•	Clean and well-structured codebase, partially covered by unit tests`,
      `•	Automated checks for pull requests and consistent code quality across the team`,
    ],
  },
];

export const About = ({ size }: AboutProps): ReactElement => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(
    null,
  );
  return (
    <>
      <Header size={size} />
      <div className='about'>
        <div className='_container'>
          <section className='about-team'>
            <div className='about-team_header_container'>
              <p className='extra-light'>Team</p>
              <Branch />
              <h2>Our team members</h2>
            </div>

            <div className='about__team'>
              {team.map((member) => (
                <div key={member.github} className='about__member'>
                  <div className='about__photo_container'>
                    <img
                      src={member.photo}
                      alt={`Photo of ${member.name}`}
                      className='about__photo'
                    />
                  </div>
                  <div className='member-info'>
                    <p className='medium'>{member.name}</p>
                    <p className='regular'>{member.role}</p>
                    <p className='extra-light bio'>{member.bio}</p>
                    <p className='extra-light contribution'>
                      <strong>Contributions:</strong> {member.contributions}
                    </p>
                    <a
                      href={member.github}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='regular'
                    >
                      GitHub Profile
                    </a>
                    <Plant className='plant' />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className='about-team-prodject'>
            <div className='about-team-prodject_header_container'>
              <p className='extra-light'>How it starts</p>
              <h2>Prodject’s Wonders Expedition</h2>
              <Branch2 />
            </div>
            <div className='about-team-prodject_text_container'>
              {questions.map((question, index) => (
                <div key={index} className='question_container'>
                  <div className='qustion_content'>
                    <h2>{question.question}</h2>
                    <button
                      className={
                        activeQuestionIndex === index ? 'arrow open' : 'arrow'
                      }
                      onClick={() =>
                        setActiveQuestionIndex(
                          activeQuestionIndex === index ? null : index,
                        )
                      }
                    >
                      <Arrow />
                    </button>
                  </div>

                  <div
                    className={
                      activeQuestionIndex === index ? 'answers open' : 'answers'
                    }
                  >
                    {question.answer.map((sentence) => (
                      <span>{sentence}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className='about-my-contribution'>
            <div className='about-my-contribution_header_container'>
              <p className='extra-light'>How it continue</p>
              <h2>My contribution</h2>
              <Branch3 />
            </div>
            <div className='about-my-contribution_text_container'>
              <div className='my-team-work_container'>
                <div className='icon_container'>
                  <Team />
                </div>
                <div className='my-work_container'>
                  <div className='my-work'>
                    <List />
                    <p className='regular'>
                      Authorization: login, registration, anonymous &
                      authenticated access
                    </p>
                  </div>
                  <div className='my-work'>
                    <List />
                    <p className='regular'>
                      Cart system: global add-to-cart functionality on all pages
                    </p>
                  </div>
                  <div className='my-work'>
                    <List />
                    <p className='regular'>
                      Product detail page: full product info & actions
                    </p>
                  </div>
                  <div className='my-work'>
                    <List />
                    <p className='regular'>
                      Helped resolve bugs & integration issues
                    </p>
                  </div>
                </div>
              </div>

              <div className='my-own-work_container'>
                <div className='icon_container'>
                  <Girl />
                </div>
                <div className='my-work_container'>
                  <div className='my-work'>
                    <List />
                    <p className='regular'>
                      Full redesign: new layout, colors, UI inspired by
                      open-source templates
                    </p>
                  </div>
                  <div className='my-work'>
                    <List />
                    <p className='regular'>
                      Rebranded the app into FloralMuse — flower & plant
                      eCommerce{' '}
                    </p>
                  </div>
                  <div className='my-work'>
                    <List />
                    <p className='regular'>
                      Added new categories and enhanced filters (by color, type,
                      etc.)
                    </p>
                  </div>
                  <div className='my-work'>
                    <List />
                    <p className='regular'>
                      Rewrote styling with Sass, improved mobile responsiveness
                    </p>
                  </div>
                  <div className='my-work'>
                    <List />
                    <p className='regular'>
                      Refactored codebase for readability, scalability & UX
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
