import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useFormikContext,
  type FormikHelpers,
  type FormikProps,
} from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import {
  registrationValidation,
  minBirthDateString,
} from '../../utils/registration-validation';
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

import { ReactComponent as EyeOpen } from './../../assets/Login/eye.svg';
import { ReactComponent as EyeClose } from './../../assets/Login/crossed-eye.svg';
import { ReactComponent as Branch } from './../../assets/Registration/branch.svg';
import { ReactComponent as Left } from './../../assets/Catalog/angle-small-left.svg';
import { ReactComponent as Right } from './../../assets/Catalog/angle-small-right.svg';

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

  const initialValues: RegistrationValues = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    shippingAddress: {
      id: '',
      streetName: '',
      city: '',
      postalCode: '',
      country: '',
    },
    billingAddress: {
      id: '',
      streetName: '',
      city: '',
      postalCode: '',
      country: '',
    },
    useSameAddress: false,
    defaultShippingAddress: false,
    defaultBillingAddress: false,
  };

  async function handleSubmit(
    values: RegistrationValues,
    { setSubmitting, setFieldError }: FormikHelpers<RegistrationValues>,
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
          setFieldError('email', 'An account with this email already exists.');
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
          const { values, isSubmitting } = formik;
          return (
            <div className='_container'>
              <div className='registration-container'>
                <Form noValidate className='registration-content'>
                  <Branch className='branch' />
                  <AddressSyncer />
                  <div className='registration-header-container'>
                    <h1>Registration</h1>
                  </div>
                  <div className='registration-form__slides-wrapper'>
                    <div
                      className='registration-form__slides'
                      style={{ transform: `translateX(-${slide * 100}%)` }}
                    >
                      <div className='registration-form__slide'>
                        <div className='data_container'>
                          <div className='input-container'>
                            <div className='input-name'>
                              <h3>Email</h3>
                            </div>
                            <Field
                              id='email'
                              name='email'
                              type='email'
                              placeholder='you@example.com'
                              required
                              aria-required='true'
                            />
                            <ErrorMessage
                              name='email'
                              component='p'
                              className='extra-light'
                            />
                          </div>
                          <div className='input-container'>
                            <div className='input-name'>
                              <h3>Password</h3>
                            </div>
                            <div className='pass-with-eye-container'>
                              <Field
                                id='password'
                                name='password'
                                type={showPassword ? 'text' : 'password'}
                                required
                                aria-required='true'
                                className='password-input'
                              />
                              <div
                                className='password-visibility-icon-container'
                                onClick={() =>
                                  setShowPassword((previous) => !previous)
                                }
                              >
                                {showPassword ? (
                                  <EyeOpen className='eye' />
                                ) : (
                                  <EyeClose className='eye' />
                                )}
                              </div>
                            </div>
                            <ErrorMessage
                              name='password'
                              component='p'
                              className='extra-light'
                            />
                          </div>
                        </div>
                      </div>
                      <div className='registration-form__slide'>
                        <div className='data_container'>
                          <div className='input-container'>
                            <div className='input-name'>
                              <h3>First name</h3>
                            </div>
                            <Field
                              id='firstName'
                              name='firstName'
                              type='text'
                              required
                              aria-required='true'
                            />
                            <ErrorMessage
                              name='firstName'
                              component='p'
                              className='extra-light'
                            />
                          </div>
                          <div className='input-container'>
                            <div className='input-name'>
                              <h3>Last Name</h3>
                            </div>
                            <Field
                              id='lastName'
                              name='lastName'
                              type='text'
                              required
                              aria-required='true'
                            />
                            <ErrorMessage
                              name='lastName'
                              component='p'
                              className='extra-light'
                            />
                          </div>
                          <div className='input-container'>
                            <div className='input-name'>
                              <h3>Date of Birth</h3>
                            </div>
                            <Field
                              id='dateOfBirth'
                              name='dateOfBirth'
                              type='date'
                              required
                              aria-required='true'
                              max={minBirthDateString}
                            />
                            <ErrorMessage
                              name='dateOfBirth'
                              component='p'
                              className='extra-light'
                            />
                          </div>
                        </div>
                      </div>

                      <div className='registration-form__slide'>
                        <div className='data_container'>
                          <fieldset>
                            <h2>Shipping Address</h2>
                            <div className='country-city_container'>
                              <div className='input-container'>
                                <div className='input-name'>
                                  <h3>Country</h3>
                                </div>

                                <Field
                                  id='shippingAddress.country'
                                  name='shippingAddress.country'
                                  as='select'
                                  required
                                  className='country-select'
                                >
                                  <option value=''>Select a country</option>
                                  <option value='BY'>Belarus</option>
                                  <option value='GE'>Georgia</option>
                                  <option value='PL'>Poland</option>
                                </Field>
                                <ErrorMessage
                                  name='shippingAddress.country'
                                  component='p'
                                  className='extra-light'
                                />
                              </div>

                              <div className='input-container'>
                                <div className='input-name'>
                                  <h3>City</h3>
                                </div>
                                <Field
                                  id='shippingAddress.city'
                                  name='shippingAddress.city'
                                  type='text'
                                  required
                                />
                                <ErrorMessage
                                  name='shippingAddress.city'
                                  component='p'
                                  className='extra-light'
                                />
                              </div>
                            </div>

                            <div className='postal-street_container'>
                              <div className='input-container'>
                                <div className='input-name'>
                                  <h3>Postal Code</h3>
                                </div>

                                <Field
                                  id='shippingAddress.postalCode'
                                  name='shippingAddress.postalCode'
                                  type='text'
                                  required
                                />
                                <ErrorMessage
                                  name='shippingAddress.postalCode'
                                  component='p'
                                  className='extra-light'
                                />
                              </div>
                              <div className='input-container'>
                                <div className='input-name'>
                                  <h3>Street</h3>
                                </div>
                                <Field
                                  id='shippingAddress.streetName'
                                  name='shippingAddress.streetName'
                                  type='text'
                                  required
                                />
                                <ErrorMessage
                                  name='shippingAddress.streetName'
                                  component='p'
                                  className='extra-light'
                                />
                              </div>
                            </div>
                          </fieldset>
                          <div className='input-container checkbox'>
                            <Field
                              id='defaultShippingAddress'
                              type='checkbox'
                              name='defaultShippingAddress'
                            />
                            <p className='extra-light'>
                              Set as default shipping address
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='registration-form__slide'>
                        <div className='data_container'>
                          <fieldset disabled={values.useSameAddress}>
                            <h2>Billing Address</h2>
                            <div className='country-city_container'>
                              <div className='input-container'>
                                <div className='input-name'>
                                  <h3>Country</h3>
                                </div>

                                <Field
                                  id='billingAddress.country'
                                  name='billingAddress.country'
                                  as='select'
                                  className='country-select'
                                  required={!values.useSameAddress}
                                >
                                  <option value=''>Select a country</option>
                                  <option value='BY'>Belarus</option>
                                  <option value='GE'>Georgia</option>
                                  <option value='PL'>Poland</option>
                                </Field>
                                <ErrorMessage
                                  name='billingAddress.country'
                                  component='p'
                                  className='extra-light'
                                />
                              </div>

                              <div className='input-container'>
                                <div className='input-name'>
                                  <h3>City</h3>
                                </div>
                                <Field
                                  id='billingAddress.city'
                                  name='billingAddress.city'
                                  type='text'
                                  required={!values.useSameAddress}
                                />
                                <ErrorMessage
                                  name='billingAddress.city'
                                  component='p'
                                  className='extra-light'
                                />
                              </div>
                            </div>

                            <div className='postal-street_container'>
                              <div className='input-container'>
                                <div className='input-name'>
                                  <h3>Postal Code</h3>
                                </div>

                                <Field
                                  id='billingAddress.postalCode'
                                  name='billingAddress.postalCode'
                                  type='text'
                                  required={!values.useSameAddress}
                                />
                                <ErrorMessage
                                  name='billingAddress.postalCode'
                                  component='p'
                                  className='extra-light'
                                />
                              </div>
                              <div className='input-container'>
                                <div className='input-name'>
                                  <h3>Street</h3>
                                </div>
                                <Field
                                  id='billingAddress.streetName'
                                  name='billingAddress.streetName'
                                  type='text'
                                  required={!values.useSameAddress}
                                />
                                <ErrorMessage
                                  name='billingAddress.streetName'
                                  component='p'
                                  className='extra-light'
                                />
                              </div>
                            </div>
                          </fieldset>

                          <div className='input-container checkbox'>
                            <Field
                              id='useSameAddress'
                              type='checkbox'
                              name='useSameAddress'
                            />
                            <p className='extra-light'>
                              Use same address for billing
                            </p>
                          </div>
                          <div className='input-container checkbox'>
                            <Field
                              id='defaultBillingAddress'
                              type='checkbox'
                              name='defaultBillingAddress'
                            />
                            <p className='extra-light'>
                              Set as default billing address
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='registration-form__slide-controls'>
                    <button
                      type='button'
                      onClick={() => setSlide(Math.max(0, slide - 1))}
                      disabled={slide === 0}
                    >
                      <Left className='slider-arrow' />
                    </button>
                    <button
                      type='button'
                      onClick={() => setSlide(Math.min(maxSlide, slide + 1))}
                      disabled={slide === maxSlide}
                    >
                      <Right className='slider-arrow' />
                    </button>
                  </div>
                  <div className='button_container'>
                    <button
                      className='reg-button'
                      type='submit'
                      disabled={isSubmitting}
                    >
                      <span>Registration</span>
                    </button>
                  </div>

                  <div className='missing-account-message'>
                    <p className='extra-light'>Already have an account?</p>
                    <p className='create-account-link medium'>
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
          <div className='registration-success-container'>
            <div className='registration-success-text'>
              You have successfully registered!
            </div>
          </div>
        </Modal>
      )}
      {modalError && (
        <div className='modal-overlay' onClick={() => setModalError(null)}>
          <div className='modal' onClick={(event) => event.stopPropagation()}>
            <p>{modalError}</p>
            <button type='button' onClick={() => setModalError(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
