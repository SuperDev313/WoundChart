import { Link } from 'react-router-dom'
import React from 'react'
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardTitle,
    CardImg,
    CardText,
    CardBody
} from 'reactstrap'

import Avatar from '@components/avatar'
import { MessageSquare } from 'react-feather'

const BeforeAfterCard = ({wounds}) => {
    console.log(wounds);

    return (
        <>
            {wounds.map((wound) => (
                <Card key={wound.trackingId}>
                    <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
                        <CardTitle tag="h4">{`${wound.wound_type}, (${wound.trackingId})`}</CardTitle>
                    </CardHeader>
                    <CardBody className="my-1 py-25">
                        <Row className="gx-4">
                            <Col md="6">
                                <Card>
                                    <CardImg
                                        className="img-fluid"
                                        // src={wound.FirstVisit.image}
                                        src="https://mso.woundcharts.app/emr/content/wound-photos/1679670449_21761.jpg"
                                        alt="First Visit"
                                        style={{ objectFit: 'cover', height: '300px' }}
                                        top
                                    />
                                    <CardBody>
                                        <CardTitle tag="h4">First Visit on {wound.FirstVisit.VisitDate}</CardTitle>
                                        <CardText>
                                            <h6 className="fw-bolder mb-25">Wound Type:</h6>
                                            <p>{wound.FirstVisit.type}</p>
                                            <h6 className="fw-bolder mb-25">Wound Measurement:</h6>
                                            <ul>
                                                <li>Length: {wound.FirstVisit.Measurement.Length}</li>
                                                <li>Width: {wound.FirstVisit.Measurement.Width}</li>
                                                <li>Depth: {wound.FirstVisit.Measurement.Depth}</li>
                                            </ul>
                                            <h6 className="fw-bolder mb-25">Granulation Tissue:</h6>
                                            <p>{wound.FirstVisit.GranulationTissue}</p>
                                            <h6 className="fw-bolder mb-25">Fibrin Tissue:</h6>
                                            <p>{wound.FirstVisit.SloughTissue}</p>
                                            <h6 className="fw-bolder mb-25">Necrotic Tissue:</h6>
                                            <p>{wound.FirstVisit.SloughTissue}</p>
                                            <h6 className="fw-bolder mb-25">Type of Exudate:</h6>
                                            <p>{wound.FirstVisit.TypeOfExudate}</p>
                                            <h6 className="fw-bolder mb-25">Amount of Exudate:</h6>
                                            <p>{wound.FirstVisit.AmountOfExudate}</p>
                                            <h6 className="fw-bolder mb-25">Periwound:</h6>
                                            <p>{wound.FirstVisit.Periwound}</p>
                                            <h6 className="fw-bolder mb-25">Wound Cleanser:</h6>
                                            <p>{wound.FirstVisit.WoundCleanser}</p>
                                            <h6 className="fw-bolder mb-25">Additional Cleanser:</h6>
                                            <p>{wound.FirstVisit.AdditionalCleansers}</p>
                                            <h6 className="fw-bolder mb-25">Primary Dressing:</h6>
                                            <p>{wound.FirstVisit.PrimaryDressing}</p>
                                            <h6 className="fw-bolder mb-25">Other Primary Dressing:</h6>
                                            <p>{wound.FirstVisit.OtherPrimaryDressing}</p>
                                            <h6 className="fw-bolder mb-25">Secondary Dressing:</h6>
                                            <p>{wound.FirstVisit.SecondaryDressing}</p>
                                            <h6 className="fw-bolder mb-25">Secure Dressing:</h6>
                                            <p>{wound.FirstVisit.SecureDressing}</p>
                                            <h6 className="fw-bolder mb-25">Peri-Wound Skin Treatment:</h6>
                                            <p>{wound.FirstVisit.TunnelingAndUnderminingTreat}</p>
                                        </CardText>
                                        <hr />
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="6">
                                <Card>
                                    <CardImg
                                        className="img-fluid"
                                        src={'https://mso.woundcharts.app/emr/content/wound-photos/1689250916_37794.jpg'}
                                        alt="Latest Visit"
                                        style={{ objectFit: 'cover', height: '300px' }}
                                        top
                                    />
                                    <CardBody>
                                        <CardTitle tag="h4">Latest Visit on {wound.LatestVisit.date}</CardTitle>
                                        <CardText>
                                            <h6 className="fw-bolder mb-25">Wound Type:</h6>
                                            <p>{wound.LatestVisit.type}</p>
                                            <h6 className="fw-bolder mb-25">Wound Measurement:</h6>
                                            <ul>
                                                <li>Length: {wound.LatestVisit.Measurement.Length}</li>
                                                <li>Width: {wound.LatestVisit.Measurement.Width}</li>
                                                <li>Depth: {wound.LatestVisit.Measurement.Depth}</li>
                                            </ul>
                                            <h6 className="fw-bolder mb-25">Granulation Tissue:</h6>
                                            <p>{wound.LatestVisit.GranulationTissue}</p>
                                            <h6 className="fw-bolder mb-25">Fibrin Tissue:</h6>
                                            <p>{wound.LatestVisit.SloughTissue}</p>
                                            <h6 className="fw-bolder mb-25">Necrotic Tissue:</h6>
                                            <p>{wound.LatestVisit.SloughTissue}</p>
                                            <h6 className="fw-bolder mb-25">Type of Exudate:</h6>
                                            <p>{wound.LatestVisit.TypeOfExudate}</p>
                                            <h6 className="fw-bolder mb-25">Amount of Exudate:</h6>
                                            <p>{wound.LatestVisit.AmountOfExudate}</p>
                                            <h6 className="fw-bolder mb-25">Periwound:</h6>
                                            <p>{wound.LatestVisit.Periwound}</p>
                                            <h6 className="fw-bolder mb-25">Wound Cleanser:</h6>
                                            <p>{wound.LatestVisit.WoundCleanser}</p>
                                            <h6 className="fw-bolder mb-25">Additional Cleanser:</h6>
                                            <p>{wound.LatestVisit.AdditionalCleansers}</p>
                                            <h6 className="fw-bolder mb-25">Primary Dressing:</h6>
                                            <p>{wound.LatestVisit.PrimaryDressing}</p>
                                            <h6 className="fw-bolder mb-25">Other Primary Dressing:</h6>
                                            <p>{wound.LatestVisit.OtherPrimaryDressing}</p>
                                            <h6 className="fw-bolder mb-25">Secondary Dressing:</h6>
                                            <p>{wound.LatestVisit.SecondaryDressing}</p>
                                            <h6 className="fw-bolder mb-25">Secure Dressing:</h6>
                                            <p>{wound.LatestVisit.SecureDressing}</p>
                                            <h6 className="fw-bolder mb-25">Peri-Wound Skin Treatment:</h6>
                                            <p>{wound.LatestVisit.TunnelingAndUnderminingTreat}</p>
                                        </CardText>
                                        <hr />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            ))}
        </>
    );
}

export default BeforeAfterCard
