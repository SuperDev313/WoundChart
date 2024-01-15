// ** Reactstrap Imports
import { Button, Form, Input, Row, Col } from 'reactstrap';

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin';

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/coming-soon.svg';
import illustrationsDark from '@src/assets/images/pages/coming-soon-dark.svg';

// ** Styles
import '@styles/base/pages/page-misc.scss';

const ComingSoonPage = () => {
  // ** Hooks
  const { skin } = useSkin();

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight;

  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
        <svg viewBox='0 0 139 95' version='1.1' height='28'>
          {/* SVG content for your logo */}
        </svg>
        <h2 className='brand-text text-primary ms-1'>Vuexy</h2>
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>Coming Soon 🚧</h2>
          <p className='mb-3'>We're working hard to bring you something awesome. Stay tuned!</p>
          <img className='img-fluid' src={source} alt='Coming soon page' />
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
