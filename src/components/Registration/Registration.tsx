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
import './Registration.scss';
import { formatValuesToRegistration } from '../../utils/format-values-to-registration';
import { AuthContext } from '../../context/AuthContext';
import Modal from '../../utils/modal/modal';

const AddressSyncer: React.FC = (): React.ReactElement | null => {
  const { values, setFieldValue } = useFormikContext<RegistrationValues>();

  useEffect(() => {
    if (values.useSameAddress) {
      setFieldValue('billingAddress', values.shippingAddress);
    }
  }, [values.useSameAddress, values.shippingAddress, setFieldValue]);
  return null;
};

export const Registration: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const [modalError, setModalError] = useState<string | null>(null);
  const auth = React.useContext(AuthContext);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('customer-token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleCloseWindow = (): void => {
    navigate('/');
  };

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

      <Formik<RegistrationValues>
        initialValues={initialValues}
        validationSchema={registrationValidation}
        onSubmit={handleSubmit}
      >
        {(formik: FormikProps<RegistrationValues>) => {
          const { values, isSubmitting } = formik;
          return (
            <Form noValidate className='registration-form'>
              <AddressSyncer />
              <div className='registration-header-container'>
                <div className='registration-header-name'>Registartion</div>
                  <button
                    className='registration-close-button'
                    onClick={handleCloseWindow}
                  >
                    x
                  </button>
              </div>
              <div className="registration-form__slides-wrapper">
                <div 
                  className="registration-form__slides" 
                  style={{ transform: `translateX(-${slide * 100}%)` }}
                >
                  <div className="registration-form__slide">
                    {/* Email */}
                    <div>
                      <label htmlFor='email'>Email</label>
                      <Field
                        id='email'
                        name='email'
                        type='email'
                        placeholder='you@example.com'
                        required
                        aria-required='true'
                      />
                      <ErrorMessage name='email' component='div' className='error' />
                    </div>
      
                {/* Password */}
                    <div>
                      <label htmlFor='password'>Password</label>
                      <Field
                        id='password'
                        name='password'
                        type='password'
                        required
                        aria-required='true'
                      />
                      <ErrorMessage
                        name='password'
                        component='div'
                        className='error'
                      />
                    </div>
                  </div>
                
                {/* First & Last Name */}
                  <div className="registration-form__slide">
                    <div>
                      <label htmlFor='firstName'>First Name</label>
                      <Field
                        id='firstName'
                        name='firstName'
                        type='text'
                        required
                        aria-required='true'
                      />
                      <ErrorMessage
                        name='firstName'
                        component='div'
                        className='error'
                      />
                    </div>
                    <div>
                      <label htmlFor='lastName'>Last Name</label>
                      <Field
                        id='lastName'
                        name='lastName'
                        type='text'
                        required
                        aria-required='true'
                      />
                      <ErrorMessage
                        name='lastName'
                        component='div'
                        className='error'
                      />
                    </div>

                  {/* Date of Birth */}
                    <div>
                      <label htmlFor='dateOfBirth'>Date of Birth</label>
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
                        component='div'
                        className='error'
                      />
                    </div>
                  </div>

                {/* Shipping Address */}
                  <div className="registration-form__slide">
                    <fieldset>
                      <legend>Shipping Address</legend>
                      <div>
                        <label htmlFor='shippingAddress.streetName'>Street</label>
                        <Field
                          id='shippingAddress.streetName'
                          name='shippingAddress.streetName'
                          type='text'
                          required
                        />
                        <ErrorMessage
                          name='shippingAddress.streetName'
                          component='div'
                          className='error'
                        />
                      </div>
                      <div>
                        <label htmlFor='shippingAddress.city'>City</label>
                        <Field
                          id='shippingAddress.city'
                          name='shippingAddress.city'
                          type='text'
                          required
                        />
                        <ErrorMessage
                          name='shippingAddress.city'
                          component='div'
                          className='error'
                        />
                      </div>
                      <div>
                        <label htmlFor='shippingAddress.country'>Country</label>
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
                          component='div'
                          className='error'
                        />
                      </div>
                      <div>
                        <label htmlFor='shippingAddress.postalCode'>
                          Postal Code
                        </label>
                        <Field
                          id='shippingAddress.postalCode'
                          name='shippingAddress.postalCode'
                          type='text'
                          required
                        />
                        <ErrorMessage
                          name='shippingAddress.postalCode'
                          component='div'
                          className='error'
                        />
                      </div>
                    </fieldset>

                    
                  </div>
                  <div className="registration-form__slide">
                    {/* Use same address for billing */}
                    <div>
                      <label htmlFor='useSameAddress'>
                        <Field
                          id='useSameAddress'
                          type='checkbox'
                          name='useSameAddress'
                        />
                        Use same address for billing
                      </label>
                    </div>

                    {/* Billing Address */}
                    <fieldset disabled={values.useSameAddress}>
                      <legend>Billing Address</legend>
                      <div>
                        <label htmlFor='billingAddress.streetName'>Street</label>
                        <Field
                          id='billingAddress.streetName'
                          name='billingAddress.streetName'
                          type='text'
                          required={!values.useSameAddress}
                        />
                        <ErrorMessage
                          name='billingAddress.streetName'
                          component='div'
                          className='error'
                        />
                      </div>
                      <div>
                        <label htmlFor='billingAddress.city'>City</label>
                        <Field
                          id='billingAddress.city'
                          name='billingAddress.city'
                          type='text'
                          required={!values.useSameAddress}
                        />
                        <ErrorMessage
                          name='billingAddress.city'
                          component='div'
                          className='error'
                        />
                      </div>
                      <div>
                        <label htmlFor='billingAddress.country'>Country</label>
                        <Field
                          id='billingAddress.country'
                          name='billingAddress.country'
                          as='select'
                          required={!values.useSameAddress}
                          className='country-select'
                        >
                          <option value=''>Select a country</option>
                          <option value='BY'>Belarus</option>
                          <option value='GE'>Georgia</option>
                          <option value='PL'>Poland</option>
                        </Field>
                        <ErrorMessage
                          name='billingAddress.country'
                          component='div'
                          className='error'
                        />
                      </div>
                      <div>
                        <label htmlFor='billingAddress.postalCode'>Postal Code</label>
                        <Field
                          id='billingAddress.postalCode'
                          name='billingAddress.postalCode'
                          type='text'
                          required={!values.useSameAddress}
                        />
                        <ErrorMessage
                          name='billingAddress.postalCode'
                          component='div'
                          className='error'
                        />
                      </div>
                    </fieldset>

                    {/* Default address checkboxes */}
                    <div>
                      <label htmlFor='defaultShippingAddress'>
                        <Field
                          id='defaultShippingAddress'
                          type='checkbox'
                          name='defaultShippingAddress'
                        />
                        Set as default shipping address
                      </label>
                    </div>
                    <div>
                      <label htmlFor='defaultBillingAddress'>
                        <Field
                          id='defaultBillingAddress'
                          type='checkbox'
                          name='defaultBillingAddress'
                        />
                        Set as default billing address
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="registration-form__slide-controls">
                <button 
                  type="button"
                  onClick={() => setSlide(Math.max(0, slide - 1))}
                  disabled={slide === 0}>
                    ‹ Prev
                </button>
                <button
                  type="button"
                  onClick={() => setSlide(Math.min(maxSlide, slide + 1))}
                  disabled={slide === maxSlide}>
                  Next ›
                </button>
              </div>
              <button type='submit' disabled={isSubmitting}>
                Register
              </button>
              
              <p className='switch-form'>
                Already have an account? <Link to='/login'>Login</Link>
              </p>
            </Form>
          );
        }}
      </Formik>
      {modalActive && (
        <Modal active={modalActive} setActive={setModalActive}>
          <div className='registration-success-container'>
            <div className='registration-success-text'>
              You have successfully registered!
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
