import { useState, useEffect, type ReactElement } from 'react';
import './UserProfilePage.scss';
import Header, { type HeaderProps } from '../Header/Header';
type UserProps = HeaderProps & {};

import {
  fetchCustomerProfile,
  CtError,
} from '../../services/customer-data/customer-data-service';
import type { UserProfile } from '../../types/user-profile';
import UserMainInfo from './UserMainInfo';
import UserAddressesInfo from './UserAddresses';
import UserPassword from './UserPassword';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Spinner from '../../assets/spinner.gif';

import { ReactComponent as Branch } from './../../assets/Main/branch3.svg';

export const UserProfilePage = ({ size }: UserProps): ReactElement => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const [showMain, setShowMain] = useState(true);
  const [showAddresses, setShowAddresses] = useState(false);

  useEffect(() => {
    fetchCustomerProfile()
      .then((data) => {
        setProfile(data);
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof CtError
            ? 'Failed to load profile'
            : 'Unexpected error',
        );
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('customer-token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  if (errorMessage) {
    return (
      <>
        <Header size={size} />
        <div className='user-profile'>
          <p className='user-profile__error'>{errorMessage}</p>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header size={size} />
        <div className='user-profile__spinner'>
          <div className='user-profile__spinner-image'>
            <img src={Spinner} alt='Loading...' />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header size={size} />
      <div className='user-profile'>
        <div className='_container'>
          <div className='user-profile__content'>
            <div className='user-profile__menu'>
              <button
                className='user-profile__menu-button'
                onClick={() => {
                  setShowAddresses((previous) => !previous);
                  setShowMain((previous) => !previous);
                }}
              >
                <p className='user-profile__menu-label medium'>Main</p>
              </button>
              <button
                className='user-profile__menu-button'
                onClick={() => {
                  setShowAddresses((previous) => !previous);
                  setShowMain((previous) => !previous);
                }}
              >
                <p className='user-profile__menu-label medium'>Addresses</p>
              </button>

              <div className='user-profile__password medium'>
                <UserPassword userData={profile} setProfile={setProfile} />
              </div>
              <Branch className='user-profile__branch' />
            </div>
            <div className='user-profile__data'>
              {showAddresses && (
                <UserAddressesInfo userData={profile} setProfile={setProfile} />
              )}
              {showMain && (
                <UserMainInfo userData={profile} setProfile={setProfile} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfilePage;
