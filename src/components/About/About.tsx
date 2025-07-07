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
import {
  OwnWork,
  Questions,
  TeamMembers,
  TeamWork,
} from '../../data/about-page';

export type AboutProps = HeaderProps & {};

export const About = ({ size }: AboutProps): ReactElement => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(
    null,
  );
  return (
    <>
      <Header size={size} />
      <div className='about'>
        <div className='_container'>
          <section className='about__team'>
            <div className='about__team-header'>
              <p className='about__team-header-subtitle extra-light'>Team</p>
              <Branch />
              <h2 className='about__team-header-title'>Our team members</h2>
            </div>

            <div className='about__team-list'>
              {TeamMembers.map((member) => (
                <div key={member.github} className='about__team-member'>
                  <div className='about__team-member-photo-container'>
                    <img
                      src={member.photo}
                      alt={`Photo of ${member.name}`}
                      className='about__team-member-photo-container-photo'
                    />
                  </div>
                  <div className='about__team-member-info'>
                    <p className='about__team-member-info-name medium'>
                      {member.name}
                    </p>
                    <p className='about__team-member-info-role regular'>
                      {member.role}
                    </p>
                    <p className='about__team-member-info-bio extra-light'>
                      {member.bio}
                    </p>
                    <p className='about__team-member-info-contribution extra-light'>
                      <strong>Contributions:</strong> {member.contributions}
                    </p>
                    <a
                      href={member.github}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='about__team-member-info-github regular'
                    >
                      GitHub Profile
                    </a>
                    <Plant className='about__team-plant-img' />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className='about__project'>
            <div className='about__project-header'>
              <p className='about__project-header-subtitle extra-light'>
                How it starts
              </p>
              <h2 className='about__project-header-title'>
                Prodject’s Wonders Expedition
              </h2>
              <Branch2 />
            </div>
            <div className='about__project-qa'>
              {Questions.map((question, index) => (
                <div key={index} className='about__project-qa-content'>
                  <div className='about__project-qa-content-question'>
                    <h2 className='about__project-qa-content-question-title'>
                      {question.question}
                    </h2>
                    <button
                      className={
                        activeQuestionIndex === index
                          ? 'about__project-qa-content-question-arrow open'
                          : 'about__project-qa-content-question-arrow'
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
                      activeQuestionIndex === index
                        ? 'about__project-qa-content-answer open'
                        : 'about__project-qa-content-answer'
                    }
                  >
                    {question.answer.map((sentence) => (
                      <span key={sentence}>{sentence}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className='about__contribution'>
            <div className='about__contribution-header'>
              <p className='about__contribution-header-subtitle extra-light'>
                How it continue
              </p>
              <h2 className='about__contribution-header-title'>
                My contribution
              </h2>
              <Branch3 />
            </div>
            <div className='about__contribution-content'>
              <div className='about__contribution-content-team'>
                <div className='about__contribution-icon'>
                  <Team className='about__contribution-icon-svg' />
                </div>
                <div className='about__contribution-content-list'>
                  {TeamWork.map((work) => (
                    <div
                      className='about__contribution-content-item'
                      key={work.id}
                    >
                      <List className='about__contribution-content-item-svg' />
                      <p className='about__contribution-content-item-name regular'>
                        {work.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='about__contribution-content-own'>
                <div className='about__contribution-icon'>
                  <Girl className='about__contribution-icon-svg' />
                </div>
                <div className='about__contribution-content-list'>
                  {OwnWork.map((work) => (
                    <div
                      className='about__contribution-content-item'
                      key={work.id}
                    >
                      <List className='about__contribution-content-item-svg' />
                      <p className='about__contribution-content-item-name regular'>
                        {work.name}
                      </p>
                    </div>
                  ))}
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
