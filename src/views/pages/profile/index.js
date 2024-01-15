// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import axios from 'axios'

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from 'reactstrap'

// ** Demo Components
import Tabs from './Tabs'
import Breadcrumbs from '@components/breadcrumbs'
import AccountTabContent from './AccountTabContent'
import SecurityTabContent from './SecurityTabContent'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'

const Profile = () => {
  // ** States
  const [activeTab, setActiveTab] = useState('1')
  const [data, setData] = useState(null)

  const toggleTab = tab => {
    setActiveTab(tab)
  }

  useEffect(() => {
    axios.get('/account-setting/data').then(response => setData(response.data))
  }, [])

  return (
    <Fragment>
      <Breadcrumbs title='Account Settings' data={[{ title: 'Pages' }, { title: 'Edit Profile' }]} />
      {data !== null ? (
        <Row>
          <Col xs={12}>
            <Tabs className='mb-2' activeTab={activeTab} toggleTab={toggleTab} />

            <TabContent activeTab={activeTab}>
              <TabPane tabId='1'>
                <AccountTabContent data={data.general} />
              </TabPane>
              <TabPane tabId='2'>
                <SecurityTabContent />
              </TabPane>
              {/* <TabPane tabId='3'>
                <BillingTabContent />
              </TabPane>
              <TabPane tabId='4'>
                <NotificationsTabContent />
              </TabPane>
              <TabPane tabId='5'>
                <ConnectionsTabContent />
              </TabPane> */}
            </TabContent>
          </Col>
        </Row>
      ) : null}
    </Fragment>
  )
}

export default Profile
