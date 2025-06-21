import { type FormEvent, useState, type ReactElement } from 'react';
import type { UserProfile } from '../../types/user-profile';
import Modal from '../../utils/modal/modal';
import { updateCustomerProfileWithoutAddresses } from '../../services/customer-data/customer-data-service';
import {
  validateDateOfBirth,
  validateFirstName,
  validateLastName,
  validateLogin,
} from '../../utils/validate';

type UserMainInfoProps = {
  userData: UserProfile;
  setProfile: (profile: UserProfile) => void;
};

export const UserMainInfo = ({
  userData,
  setProfile,
}: UserMainInfoProps): ReactElement => {

  const [modalActive, setModalActive] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalContent, setModalContent] = useState<
    'profile' | 'modal-message' | null
  >(null);
  const openModal = (
    type: 'profile' | 'modal-message',
    message?: string,
  ): void => {
    setModalContent(type);
    setModalActive(true);
    if (message) {
      setModalMessage(message);
    }
  };

  const [newValues, setNewValues] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    dateOfBirth: userData.dateOfBirth,
  });

  const [firstNameValidError, setFirstNameValidError] = useState('');
  const [lastNameValidError, setLastNameValidError] = useState('');
  const [emailValidError, setEmailValidError] = useState('');
  const [dateOfBirthValidError, setDateOfBirthValidError] = useState('');

  const handleSubmitMainInfo = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (
      firstNameValidError !== '' ||
      lastNameValidError !== '' ||
      emailValidError !== '' ||
      dateOfBirthValidError !== ''
    ) {
      return;
    }
    if (!userData) {
      return;
    }
    try {
      const { data, error } = await updateCustomerProfileWithoutAddresses(
        userData.version,
        {
          firstName: newValues.firstName,
          lastName: newValues.lastName,
          email: newValues.email,
          dateOfBirth: newValues.dateOfBirth,
        },
      );
      if (data) {
        openModal('modal-message', 'Your data has been updated successfully!');
        setProfile(data);
      }
      if (error === 'DuplicateField') {
        openModal(
          'modal-message',
          'This email is already busy, try another one',
        );
      }
    } catch (error) {
      void error;
      openModal('modal-message', 'Something went wrong');
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value } = event.target;
    setNewValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleReset = (): void => {
    setNewValues({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      dateOfBirth: userData.dateOfBirth,
    });
    setFirstNameValidError('');
    setLastNameValidError('');
    setEmailValidError('');
    setDateOfBirthValidError('');
  };

  return (
    <>
      <h1>User Profile</h1>
      <button
        type='button'
        className='edit-profile-btn'
        onClick={() => openModal('profile')}
      >
        Edit Profile
      </button>

      <div className='profile-summary'>
        <p>
          <strong>Name:</strong> {userData.firstName} {userData.lastName}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Date of Birth:</strong>{' '}
          {userData.dateOfBirth
            ? new Date(userData.dateOfBirth).toLocaleDateString()
            : '-'}
        </p>
      </div>

      {modalActive && (
        <Modal
          active={modalActive}
          setActive={setModalActive}
          onClose={handleReset}
        >
          {modalContent === 'profile' && (
            <div className='modal-profile-container'>
              <form
                className='modal-profile-form'
                onSubmit={handleSubmitMainInfo}
              >
                <label>
                  First Name
                  <input
                    name='firstName'
                    value={newValues.firstName}
                    onChange={(event) => {
                      handleInputChange(event);
                      setFirstNameValidError(
                        validateFirstName(event.target.value),
                      );
                    }}
                    required
                  />
                  {firstNameValidError && (
                    <span className='firstName input-validation-span'>
                      {firstNameValidError}
                    </span>
                  )}
                </label>

                <label>
                  Last Name
                  <input
                    name='lastName'
                    value={newValues.lastName}
                    onChange={(event) => {
                      handleInputChange(event);
                      setLastNameValidError(
                        validateLastName(event.target.value),
                      );
                    }}
                    required
                  />
                  {lastNameValidError && (
                    <span className='lastName input-validation-span'>
                      {lastNameValidError}
                    </span>
                  )}
                </label>

                <label>
                  Email
                  <input
                    name='email'
                    type='email'
                    value={newValues.email}
                    onChange={(event) => {
                      handleInputChange(event);
                      setEmailValidError(validateLogin(event.target.value));
                    }}
                    required
                  />
                  {emailValidError && (
                    <span className='email input-validation-span'>
                      {emailValidError}
                    </span>
                  )}
                </label>

                <label>
                  Date of Birth
                  <input
                    name='dateOfBirth'
                    type='date'
                    value={newValues.dateOfBirth}
                    onChange={(event) => {
                      handleInputChange(event);
                      setDateOfBirthValidError(
                        validateDateOfBirth(event.target.value),
                      );
                    }}
                    required
                    min='1925-01-01'
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {dateOfBirthValidError && (
                    <span className='dateOfBirth input-validation-span'>
                      {dateOfBirthValidError}
                    </span>
                  )}
                </label>
                <button type='submit'>Save</button>
              </form>
            </div>
          )}
          {modalContent === 'modal-message' && (
            <div className='update-modal-message-container'>
              <div className='update-modal-message-text'>{modalMessage}</div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default UserMainInfo;
