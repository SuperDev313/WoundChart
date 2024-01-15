// ** Icons Imports
import { Copy, MoreVertical, Edit2, Trash2 } from 'react-feather'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Badge,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'

const data = [
  {
    type: 'Full Access',
    name: 'Server Key 1',
    key: '23eaf7f0-f4f7-495e-8b86-fad3261282ac',
    date: 'Created on 28 Apr 2020, 18:20 GTM+4:10'
  },
  {
    type: 'Read Only',
    name: 'Server Key 2',
    key: 'bb98e571-a2e2-4de8-90a9-2e231b5e99',
    date: 'Created on 12 Feb 2020, 10:30 GTM+2:30'
  },
  {
    type: 'Full Access',
    name: 'Server Key 3',
    key: '2e915e59-3105-47f2-8838-6e46bf83b711',
    date: 'Created on 28 Apr 2020, 12:21 GTM+4:10'
  }
]

const ApiKeysList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>API Key List & Access</CardTitle>
      </CardHeader>
      <CardBody>
        <CardText>
          An API key is a simple encrypted string that identifies an application without any principal. They are useful
          for accessing public data anonymously, and are used to associate API requests with your project for quota and
          billing.
        </CardText>
        <Row className='gy-2'>
          {data.map(item => (
            <Col sm={12} key={item.key}>
              <div className='bg-light-secondary position-relative rounded p-2'>
                <UncontrolledDropdown className='btn-pinned'>
                  <DropdownToggle tag='span' className='cursor-pointer'>
                    <MoreVertical size={18} />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem className='d-flex align-items-center w-100'>
                      <Edit2 size={14} className='me-50' />
                      <span>Edit</span>
                    </DropdownItem>
                    <DropdownItem className='d-flex align-items-center w-100'>
                      <Trash2 size={14} className='me-50' />
                      <span>Delete</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <div className='d-flex align-items-center flex-wrap'>
                  <h4 className='mb-1 me-1'>{item.name}</h4>
                  <Badge className='mb-1' color='light-primary'>
                    {item.type}
                  </Badge>
                </div>
                <h6 className='d-flex align-items-center fw-bolder'>
                  <span className='me-50'>{item.key}</span>
                  <span className='cursor-pointer'>
                    <Copy className='font-medium-4' />
                  </span>
                </h6>
                <span>{item.date}</span>
              </div>
            </Col>
          ))}
        </Row>
      </CardBody>
    </Card>
  )
}

export default ApiKeysList
