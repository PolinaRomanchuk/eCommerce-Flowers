import { ErrorMessage, Field } from 'formik';
import { minBirthDateString } from '../../utils/registration-validation';

const Slide2PersonalInfo = (): React.ReactElement => {
  return (
    <div className='registration__slide'>
      <div className='registration__slide-data registration__slide-data--personal'>
        <div className='registration__slide__field'>
          <label htmlFor='firstName' className='registration__slide__label'>
            First name
          </label>

          <Field
            id='firstName'
            name='firstName'
            type='text'
            required
            aria-required='true'
            className='registration__slide__input'
          />
          <ErrorMessage
            name='firstName'
            component='p'
            className='registration__slide__error extra-light'
          />
        </div>
        <div className='registration__slide__field'>
          <label htmlFor='lastName' className='registration__slide__label'>
            Last Name
          </label>

          <Field
            id='lastName'
            name='lastName'
            type='text'
            required
            aria-required='true'
            className='registration__slide__input'
          />
          <ErrorMessage
            name='lastName'
            component='p'
            className='registration__slide__error extra-light'
          />
        </div>
        <div className='registration__slide__field'>
          <label htmlFor='dateOfBirth' className='registration__slide__label'>
            Date of Birth
          </label>

          <Field
            id='dateOfBirth'
            name='dateOfBirth'
            type='date'
            required
            aria-required='true'
            max={minBirthDateString}
            className='registration__slide__input'
          />
          <ErrorMessage
            name='dateOfBirth'
            component='p'
            className='registration__slide__error extra-light'
          />
        </div>
      </div>
    </div>
  );
};

export default Slide2PersonalInfo;
