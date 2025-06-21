import type { ReactElement } from 'react';
import Header, { type HeaderProps } from '../Header/Header';
import './About.scss';
import rsLogo from '../../assets/logo/rs-school-logo.png';
import Footer from '../Footer/Footer';

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo: string;
  github: string;
  contributions: string;
};

export type AboutProps = HeaderProps & {};

const team: TeamMember[] = [
  {
    name: 'Dzmitryj Saldacenka',
    role: 'Team Lead/Frontend Developer',
    bio: `I’ve built personal projects using HTML, CSS, JavaScript (React, Redux), 
      TypeScript, and REST APIs. I’m quick to learn new technologies, and thrive on problem-solving and teamwork. 
      Outside of coding, I cycle, travel, love fishing and listen to music.`,
    photo: '../assets/photos/dima.webp',
    github: 'https://github.com/Dimonchik2525',
    contributions: `Set up the repository, configured the development environment, created development scripts, 
      enhanced the main page, implemented routing, built the catalog page, and developed the detailed product page. 
        Testing and work with UI`,
  },
  {
    name: 'Polina Romanchuk',
    role: 'Frontend Developer/CommerceTools API Deliver',
    bio: `I used to work as a lawyer, but over time I realized that programming 
      feels much closer to me — it gives me a sense of freedom and creativity. 
      Now I’m continuing to learn, exploring development, and enjoying the process and personal growth.
      I love discovering new things, laughing, cats, nature, mountains, seas, and traveling.`,
    photo: '../assets/photos/polina.webp',
    github: 'https://github.com/PolinaRomanchuk',
    contributions: `Set up the CommerceTools project and API client, implemented the login page, 
      developed the detailed product page, built the cart page, 
      added end-to-end application testing, and fixed runtime issues.`,
  },
  {
    name: 'Artsiom Luksha',
    role: 'Frontend Developer/Scrum Master',
    bio: `I’m a junior frontend developer. I hold a bachelor’s in economics and law from Yanka Kupala State 
      University and have built personal projects using HTML, CSS, JavaScript (React, Redux), 
      TypeScript and REST APIs. I’m disciplined, detail-oriented, quick to learn new technologies, and enjoy 
      problem-solving and teamwork. Outside of coding, I train at the gym, cycle, explore museums, and read or
      watch films to broaden my horizons.`,
    photo: '../assets/photos/artem.jpg',
    github: 'https://github.com/AirDrop94',
    contributions: `Authored a comprehensive README, configured the project’s task board, 
      implemented the registration page, developed the user profile page, and built the About Us page. 
      Worked with UX/UI and testing.`,
  },
];

export const About = ({ size }: AboutProps): ReactElement => {
  return (
    <>
      <Header size={size} />
      <div className="about">
      
        <h2 className="about__title">Our Development Team</h2>

        <div className="about__team">
          {team.map((member) => (
            <div key={member.github} className="about__member">
              <img
                src={member.photo}
                alt={`Photo of ${member.name}`}
                className="about__photo"
              />
              <h3 className="about__name">{member.name}</h3>
              <p className="about__role">{member.role}</p>
              <p className="about__bio">{member.bio}</p>
              <p className="about__contrib">
                <strong>Contributions:</strong> {member.contributions}
              </p>
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="about__github"
              >
                GitHub Profile
              </a>
            </div>
          ))}
        </div>

        <section className="about__collaboration">
          <h2 className="about__subtitle">Collaboration</h2>
          <p>
            Our team established a clear workflow by managing tasks in Jira: each ticket includes a goal 
            description, priority, and deadline. Daily stand-ups in Discord kept us in sync we discussed progress, 
            planned sprints, and aligned priorities. When complex technical issues arose, we held brainstorming sessions, 
            shared ideas, and defended our solutions with arguments and prototypes. 
            Regular video calls in Discord (at least twice a week) ensured real-time communication and rapid blocker removal. 
            This approach enabled us to respondquickly to changes, share knowledge, 
            and collaboratively deliver the project to a successful release.
          </p>
        </section>

        <div className="about__logo">
          <p>Visit school</p>
          <a
            href="https://rs.school/"
            target="_blank"
            rel="noopener noreferrer"
            title="RS School Official Website"
          >
            <img
              src={rsLogo}
              alt="RS School Logo"
              className="about__logo-image"
            />
          </a>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default About;
