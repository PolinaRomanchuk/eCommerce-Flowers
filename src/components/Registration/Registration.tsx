import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Formik,
  Form,
  useFormikContext,
  type FormikHelpers,
  type FormikProps,
} from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { registrationValidation } from '../../utils/registration-validation';
import type { RegistrationValues } from '../../types/registration';
import {
  registerCustomer,
  CtError,
} from '../../services/registration/registration';
import './registration.scss';
import { formatValuesToRegistration } from '../../utils/format-values-to-registration';
import { AuthContext } from '../../context/AuthContext';
import Modal from '../../utils/modal/modal';
import Header, { type HeaderProps } from '../Header/Header';
import Footer from '../Footer/Footer';

import { ReactComponent as Branch } from './../../assets/Registration/branch.svg';
import { ReactComponent as Left } from './../../assets/Catalog/angle-small-left.svg';
import { ReactComponent as Right } from './../../assets/Catalog/angle-small-right.svg';
import Slide1Account from './Slide1Account';
import Slide2PersonalInfo from './Slide2PersonalInfo';
import Slide3Shipping from './Slide3Shipping';
import Slide4Billing from './Slide4Billing';
import { initialValues } from '../../utils/registration-initial-values';

const AddressSyncer: React.FC = (): React.ReactElement | null => {
  const { values, setFieldValue } = useFormikContext<RegistrationValues>();

  useEffect(() => {
    if (values.useSameAddress) {
      setFieldValue('billingAddress', values.shippingAddress);
    }
  }, [values.useSameAddress, values.shippingAddress, setFieldValue]);
  return null;
};

export type RegistrationProps = HeaderProps & {};

export const Registration = ({
  size,
}: RegistrationProps): React.ReactElement => {
  const navigate = useNavigate();
  const [modalError, setModalError] = useState<string | null>(null);
  const auth = React.useContext(AuthContext);
  const [modalActive, setModalActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('customer-token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  async function handleSubmit(
    values: RegistrationValues,
    { setSubmitting }: FormikHelpers<RegistrationValues>,
  ): Promise<void> {
    setModalError(null);
    try {
      const customerData = formatValuesToRegistration(values);
      const data = await registerCustomer(customerData);
      await auth.login(
        values.email,
        values.password,
        () => {},
        () => {
          setModalActive(true);
          setTimeout(() => {
            setModalActive(false);
            navigate('/', { replace: true });
          }, 1000);
        },
        true,
        data.id,
      );
    } catch (error: unknown) {
      if (error instanceof CtError) {
        if (error.status === 400) {
          setModalError(
            'An account with this email already exists. Try another one.',
          );
          setModalActive(true);
        } else {
          setModalError('Something went wrong. Please try again later.');
        }
      } else {
        setModalError('Unexpected error occurred.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const [slide, setSlide] = useState(0);
  const maxSlide = 3;

  return (
    <>
      <Header size={size} />
      <Formik<RegistrationValues>
        initialValues={initialValues}
        validationSchema={registrationValidation}
        onSubmit={handleSubmit}
      >
        {(formik: FormikProps<RegistrationValues>) => {
          const { isSubmitting } = formik;
          return (
            <div className='registration'>
              <div className='_container'>
                <Form noValidate className='registration__form'>
                  <Branch className='registration__branch-icon' />
                  <AddressSyncer />
                  <div className='registration__header'>
                    <h1>Registration</h1>
                  </div>
                  <div className='registration__slides-wrapper'>
                    <div
                      className='registration__slides'
                      style={{ transform: `translateX(-${slide * 100}%)` }}
                    >
                      <Slide1Account
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                      />
                      <Slide2PersonalInfo />
                      <Slide3Shipping />
                      <Slide4Billing />
                    </div>
                  </div>
                  <div className='registration__controls'>
                    <button
                      type='button'
                      onClick={() => setSlide(Math.max(0, slide - 1))}
                      disabled={slide === 0}
                    >
                      <Left className='registration__arrow' />
                    </button>
                    <button
                      type='button'
                      onClick={() => setSlide(Math.min(maxSlide, slide + 1))}
                      disabled={slide === maxSlide}
                    >
                      <Right className='registration__arrow' />
                    </button>
                  </div>
                  <div className='registration__submit-container'>
                    <button
                      className='registration__submit-container-button'
                      type='submit'
                      disabled={isSubmitting}
                    >
                      <span>Registration</span>
                    </button>
                  </div>

                  <div className='registration__already-have-account'>
                    <p className='extra-light'>Already have an account?</p>
                    <p className='registration__login-link medium'>
                      <Link to={'/login'}>Login</Link>
                    </p>
                  </div>
                </Form>
              </div>
            </div>
          );
        }}
      </Formik>
      <Footer />
      {modalActive && (
        <Modal active={modalActive} setActive={setModalActive}>
          <div className='registration__modal'>
            <div className='registration__modal-text'>
              {modalError ? modalError : 'You have successfully registered!'}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
