import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import './style.css';
import Checkbox from '../Checkbox/Checkbox';
import { get } from '../Service/Service'

const validationSchema = Yup.object({

});
const onSubmit = (values) => { console.log(values) }

const initialValues = {
    category: 'any',
    customes: [
        { value: false, name: "programming" },
        { value: false, name: "misk" },
        { value: false, name: "dark" },
        { value: false, name: "pun" },
        { value: false, name: "spooky" },
        { value: false, name: "christmas" }
    ],
    defaultLanguage: "en",
    blacklist: [
        { value: false, name: "nsfw" },
        { value: false, name: "religious" },
        { value: false, name: "political" },
        { value: false, name: "racist" },
        { value: false, name: "sexiest" },
        { value: false, name: "explicit" }
    ],
    jokeType: [{ value: true, name: "single" }, { value: true, name: "twopart" }],
    searchString: '',
    idFrom: 0,
    idTo: 1368,
    amountOfJoke: 1

}

export class Homepage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialValues,
            onSubmit,
            validationSchema
        }
    }

    componentDidMount() {
        async function getData() {
            let res = await get('info');
            console.log(res);
            let { jokes } = res;
            let { categories } = jokes;
            let customes = [];
            for (let i = 1; i <= categories.length; i++) { 
                customes.push({value:false,name:categories[i]})
            }
        }
        getData();
    }


    render() {
        return (
            <Formik
                initialValues={this.state.initialValues}
                validationSchema={this.state.validationSchema}
                onSubmit={this.state.onSubmit}
            >
                {({ values, handleChange, handleBlur }) => (
                    <div className="my-class">
                        <Container className="my-container shadow">
                            <Form>
                                <Row className="edit-row">
                                    <Col sm={3} className="guide-text"> Select category / categories : </Col>
                                    <Col sm={9} className="options border rounded border-white p-2">

                                        <div className="form-check">
                                            <Field
                                                type="radio"
                                                id="ANY"
                                                name="category"
                                                value="any"
                                                className="form-check-input"
                                            // checked={values.category === "any"}
                                            />{' '}
                                            <label htmlFor="ANY" className="form-check-label">
                                                Any
                                            </label>
                                        </div>
                                        <div className="d-inline-flex">
                                            <div className="form-check">
                                                <Field
                                                    type="radio"
                                                    id="Custom"
                                                    name="category"
                                                    value="custom"
                                                    className="form-check-input"
                                                />{' '}
                                                <label
                                                    htmlFor="Custom"
                                                    className="form-check-label"
                                                >
                                                    Custom
                                                </label>
                                            </div>
                                            {values.customes.map(({ name }, index) => <Checkbox key={index}
                                                className1={`form-check mx-2 ${values.category === 'custom' ? '' : 'noDrop '}`}
                                                className2={`form-check-input ${values.category === 'custom' ? '' : 'noDrop disable'}`}
                                                className3={`form-check-label ${values.category === 'custom' ? '' : 'noDrop disable'}`}
                                                name={`customes[${index}].value`}
                                                label={name}
                                                value={values.customes[index].value}
                                            />
                                            )}
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="edit-row mt-4">
                                    <Col sm={3} className="guide-text"> Select language : </Col>
                                    <Col sm={9} className="options border rounded border-white p-2 mt-2">
                                        <div>
                                            <select
                                                name="language"
                                                value={values.defaultLanguage}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            >
                                                <option value="cs">cs-Czech</option>
                                                <option value="de">de-German</option>
                                                <option value="en">en-English</option>
                                                <option value="es">es-Spanish</option>
                                                <option value="fr">fr-French</option>
                                                <option value="pt">pt-Portuguese</option>
                                            </select>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="edit-row mt-4">
                                    <Col sm={3} className="guide-text"> Select flags to blacklist : </Col>
                                    <Col sm={9} className="options border rounded border-white p-2 mt-2">
                                        <div className="d-flex">
                                            <div className="me-3"> (optional)</div>
                                            {values.blacklist.map(({ name }, index) => <Checkbox
                                                key={index}
                                                className1="form-check mx-2"
                                                className2="form-check-input"
                                                className3="form-check-label"
                                                name={`blacklist[${index}].value`}
                                                label={name}
                                                value={values.blacklist[index].value}
                                            />
                                            )}

                                        </div>
                                    </Col>
                                </Row>

                                <Row className="edit-row mt-4">
                                    <Col sm={3} className="guide-text"> Select at least one joke type :  </Col>
                                    <Col sm={9} className="options border rounded border-white p-2 mt-3">
                                        <div className="d-flex">
                                            {values.jokeType.map(({ name }, index) => <Checkbox
                                                key={index}
                                                className1="form-check mx-2"
                                                className2="form-check-input"
                                                className3="form-check-label"
                                                name={`blacklist[${index}].value`}
                                                label={name}
                                                value={values.jokeType[index]}
                                            />
                                            )}
                                        </div>
                                    </Col>
                                </Row>



                                <Row className="edit-row mt-4">
                                    <Col sm={3} className="guide-text">Search for a joke that contains this search string :  </Col>
                                    <Col sm={9} className="options border rounded border-white p-2 mt-3">
                                        <div>
                                            <Field
                                                type="text"
                                                name="searchString"
                                                placeholder="(optional)"
                                                className="form-control mt-1" />
                                        </div>
                                    </Col>
                                </Row>


                                <Row className="edit-row mt-4">
                                    <Col sm={3} className="guide-text">Search for a joke in this ID range :  </Col>
                                    <Col sm={9} className="options border rounded border-white p-2 mt-3">
                                        <div className="row g-3 align-items-center">
                                            <div className="col-auto">
                                                <label className="col-form-label">(optional)</label>
                                            </div>


                                            <div className="col-auto">
                                                <label htmlFor="from" className="col-form-label">From</label>
                                            </div>
                                            <div className="col-auto">
                                                <Field
                                                    type="number"
                                                    id="from"
                                                    className="form-control"
                                                    value={values.idFrom}
                                                />
                                            </div>


                                            <div className="col-auto">
                                                <label
                                                    htmlFor="to" className="col-form-label">to</label>
                                            </div>
                                            <div className="col-auto">
                                                <Field
                                                    type="number"
                                                    id="to"
                                                    className="form-control"
                                                    value={values.idTo}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>


                                <Row className="edit-row mt-4">
                                    <Col sm={3} className="guide-text">Amount of jokes :   </Col>
                                    <Col sm={9} className="options border rounded border-white p-2 mt-3">
                                        <div>
                                            <Field
                                                type="number"
                                                id="to"
                                                value={values.amountOfJoke}
                                            />
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="edit-row mt-4">
                                    <Col className="options border rounded border-white p-2 mt-3">
                                        <div>
                                            <div>
                                                URL :  https://v2.jokeapi.dev/joke/Any
                                                <div>
                                                    <Button type="reset" variant="light" className="mx-2 mt-2">Resert Form</Button>
                                                    <Button type="submit" variant="light" className="mx-2 mt-2">{"Send Request >"}</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="edit-row mt-4">
                                    <Col className="options border rounded border-white p-3">
                                        <div className="my-card">
                                            <div className="header">
                                                <span className="ml-2">{"</>Result "}</span>
                                            </div>
                                            <div className="Footer">

                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                            </Form>
                        </Container>
                    </div >
                )
                }
            </Formik>
        )
    }
}

export default Homepage;
