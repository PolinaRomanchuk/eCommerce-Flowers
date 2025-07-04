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
        <div className='user-profile-page'>
          <p className='error'>{errorMessage}</p>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header size={size} />
        <div className='spinner_container'>
          <div className='img-container'>
            <img src={Spinner} alt='spinner' />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header size={size} />
      <div className='user-profile-page'>
        <div className='_container'>
          <div className='user-profile-page_content'>
            <div className='menu'>
              <button
                onClick={() => {
                  setShowAddresses((previous) => !previous);
                  setShowMain((previous) => !previous);
                }}
              >
                <p className='medium'>Main</p>
              </button>
              <button
                onClick={() => {
                  setShowAddresses((previous) => !previous);
                  setShowMain((previous) => !previous);
                }}
              >
                <p className='medium'>Addresses</p>
              </button>

              <div className='medium'>
                <UserPassword userData={profile} setProfile={setProfile} />
              </div>
              <Branch className='branch' />
            </div>
            <div className='data_container'>
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
