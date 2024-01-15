// ** Third Party Components
import classnames from 'classnames'
import { Calendar, MapPin, Box, DollarSign } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col } from 'reactstrap'

const StatsCard = ({ title, subtitle, icon= <MapPin size={18} /> }) => {

  return (
      <div className='d-flex mt-2'>
        <Avatar color='light-primary' className='rounded me-1' icon={icon} />
        <div>
          <h6 className='mb-0'>{title}</h6>
          <small>{subtitle}</small>
        </div>
      </div>
  )
}

export default StatsCard
