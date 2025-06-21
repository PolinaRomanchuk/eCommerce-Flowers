import { type FormEvent, useState, type ReactElement, useContext } from 'react';
import type { UserProfile } from '../../types/user-profile';
import Modal from '../../utils/modal/modal';
import {
  changeCustomerPassword,
  fetchCustomerProfile,
} from '../../services/customer-data/customer-data-service';
import {
  validateOldPassword,
  validatePassword,
  validatePasswordConfirm,
} from '../../utils/validate';
import { AuthContext } from '../../context/AuthContext';

type UserPasswordProps = {
  userData: UserProfile;
  setProfile: (profile: UserProfile) => void;
};

export const UserPassword = ({
  userData,
  setProfile,
}: UserPasswordProps): ReactElement => {
  const [modalActive, setModalActive] = useState(false);
  const [modalContent, setModalContent] = useState<
    'password' | 'modal-message' | null
  >(null);
  const [modalMessage, setModalMessage] = useState('');
  const openModal = (
    type: 'password' | 'modal-message',
    message?: string,
  ): void => {
    setModalContent(type);
    setModalActive(true);
    if (message) {
      setModalMessage(message);
    }
  };

  const [passwordValidError, setPasswordValidError] = useState('');
  const [newPasswordValidError, setNewPasswordValidError] = useState('');
  const [confirmPasswordValidError, setConfirmPasswordValidError] =
    useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const auth = useContext(AuthContext);

  const handlePasswordSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (!userData) {
      return;
    }

    if (
      passwordValidError !== '' ||
      newPasswordValidError !== '' ||
      confirmPasswordValidError !== ''
    ) {
      return;
    }

    try {
      const { data, error } = await changeCustomerPassword({
        version: userData.version,
        currentPassword,
        newPassword,
      });
      if (data) {
        await auth?.logout();
        await auth?.anonymousAccess();
        await auth?.login(
          data.email,
          newPassword,
          () => {
            openModal('modal-message', 'Something went wrong');
          },
          () => {
            handleReset();
            openModal(
              'modal-message',
              'Your password has been successfully updated',
            );
          },
        );
        const freshData = await fetchCustomerProfile();
        setProfile(freshData);
      }
      if (error === 'InvalidCurrentPassword') {
        openModal(
          'modal-message',
          'You entered an incorrect current password.Try again',
        );
      }
    } catch (error) {
      void error;
      openModal('modal-message', 'Something went wrong');
    }
  };

  const handleReset = (): void => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordValidError('');
    setNewPasswordValidError('');
    setConfirmPasswordValidError('');
  };

  return (
    <>
      <button
        type='button'
        className='toggle-password-btn'
        onClick={() => openModal('password')}
      >
        Change Password
      </button>

      {modalActive && (
        <Modal
          active={modalActive}
          setActive={setModalActive}
          onClose={handleReset}
        >
          {modalContent === 'password' && (
            <form className='password-form' onSubmit={handlePasswordSubmit}>
              <label>
                Current Password
                <input
                  type='password'
                  value={currentPassword}
                  onChange={(event) => {
                    setCurrentPassword(event.target.value);
                    setPasswordValidError(
                      validateOldPassword(event.target.value),
                    );
                  }}
                  required
                />
                {passwordValidError && (
                  <span className='password input-validation-span'>
                    {passwordValidError}
                  </span>
                )}
              </label>
              <label>
                New Password
                <input
                  type='password'
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    setNewPasswordValidError(
                      validatePassword(event.target.value, currentPassword),
                    );
                  }}
                  required
                />
                {newPasswordValidError && (
                  <span className='password input-validation-span'>
                    {newPasswordValidError}
                  </span>
                )}
              </label>
              <label>
                Confirm New Password
                <input
                  type='password'
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setConfirmPasswordValidError(
                      validatePasswordConfirm(event.target.value, newPassword),
                    );
                  }}
                  required
                />
                {confirmPasswordValidError && (
                  <span className='password input-validation-span'>
                    {confirmPasswordValidError}
                  </span>
                )}
              </label>
              <button type='submit'>Save Password</button>
            </form>
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

export default UserPassword;
