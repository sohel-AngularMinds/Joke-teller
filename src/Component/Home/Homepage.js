import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import './style.css';
import Checkbox from '../Checkbox/Checkbox';
import { get } from '../Service/Service'

// const REACT_VERSION = React.version;


const onSubmit = (values, getUrl, state, setState) => {
    let url = getUrl(values);


    async function getData() {
        let res = await get(url);

        if (res.error) {

            let newState = state;
            newState.error = "Error while finalizing joke filtering: No jokes were found that match your provided filter(s)."
            setState(newState);
        }
        else {
            let { amount } = res;
            console.log(res);

            if (amount === undefined) {
                let { joke, delivery, type, setup } = res;

                let newState = state;
                newState.joke = [joke];
                newState.error = '';
                if (type === "twopart")
                    newState.joke = [setup, delivery];

                setState(newState);
            }
            else {
                let { jokes } = res;
                let joke = [];

                for (let i = 0; i < jokes.length; i++) {


                    if (jokes[i].type === 'single') {
                        joke.push(jokes[i].joke);
                    }

                    else {
                        joke.push(jokes[i].setup);
                        joke.push(jokes[i].delivery)
                    }


                    if (i < amount - 1) {
                        joke.push('----------------------------------------------');
                    }

                }
                // ----------------------------------------------
                let newState = state;
                newState.joke = joke;
                newState.error = '';
                setState(newState);
            }
        }
    }
    getData();



}

const validate = values => {
    let errors = {};
    //2 set name similor like name

    if (values.category === 'custom') {
        let { customes } = values;
        let error = true;
        for (let i = 0; i < customes.length; i++) {
            if (customes[i].value === true) {
                error = false;
                break;
            }
        }

        if (error) {
            errors.category = true;
        }
    }


    let error = false;

    let { jokeType } = values;

    for (let i = 0; i < jokeType.length; i++) {
        if (jokeType[i].value === true) {
            error = false;
            break;
        }
        else {
            error = true;
        }
    }

    if (error) {
        errors.jokeType = true;
    }

    if (values.idFrom > values.idTo) {
        errors.idFrom = true;
    }

    return errors
}


const initialValues = {
    category: 'Any',
    customes: [
        { value: false, name: "Programming" },
        { value: false, name: "Misc" },
        { value: false, name: "Dark" },
        { value: false, name: "Pun" },
        { value: false, name: "Spooky" },
        { value: false, name: "Christmas" }
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
    idTo: 0,
    amountOfJoke: 1,
    url: 'https://v2.jokeapi.dev/joke/'
}



class Homepage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            initialValues,
            onSubmit,
            validate,
            apiData: {},
            joke: ['(Set parameters and click "Send Request" above)'],
            error: '',
            max: 0
        }

        this.checking = this.checking.bind(this);
        this.geturl = this.geturl.bind(this);
        this.setter = this.setter.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    //this method will called after render
    async componentDidMount() {
        let res = await get('info');
        let { jokes } = res;
        let initialValue = this.state.initialValues;
        initialValue.idTo = jokes.totalCount - 1;
        this.setState({ initialValues: initialValue, apiData: jokes, max: jokes.totalCount - 1 })
    }


    setter(newState) {
        this.setState(newState);
    }

    handleReset(resetForm) {
        if (window.confirm("Are you sure to reset")) {
            resetForm();
            this.setState({ initialValues });
        }
    }

    checking(e, values) {
        values.defaultLanguage = e.target.value;
        values.idFrom = this.state.apiData.idRange[e.target.value][0];
        values.idTo = this.state.apiData.idRange[e.target.value][1];

        this.setState({ intitialValues: values, max: this.state.apiData.idRange[e.target.value][1] });
    }

    geturl(values) {
        let url = this.state.initialValues.url;
        let { idRange } = this.state.apiData

        //For Category
        if (values.category === "Any") {
            url += 'Any';
        }
        else {
            if (values.category === 'custom') {
                let { customes } = values;
                let customUrl = [];
                for (let i = 0; i < customes.length; i++) {
                    if (customes[i].value === true) {

                        if (customes[i].name === "Misc") {
                            customUrl.push("Miscellaneous");
                        }
                        else {
                            customUrl.push(customes[i].name);
                        }
                    }
                }

                if (customUrl.length === 0) {
                    url += 'Any';
                }
                else {
                    url += customUrl;
                }
            }
        }


        if (values.defaultLanguage !== 'en') {
            url += `?lang=${values.defaultLanguage}`
        }



        let { amountOfJoke, blacklist, jokeType, searchString, idFrom, idTo } = values;

        let blacklistFlag = [];

        //for blackListFlag
        for (let i = 0; i < blacklist.length; i++) {
            if (blacklist[i].value === true) {
                blacklistFlag.push(blacklist[i].name);
            }
        }

        if (values.defaultLanguage === 'en' && blacklistFlag.length > 0) {
            url += `?blacklistFlags=${blacklistFlag}`
        } else {
            if (blacklistFlag.length > 0)
                url += `&blacklistFlags=${blacklistFlag}`
        }

        //for joke type
        let falseCount = 0;
        let falseIndex = -1;
        for (let i = 0; i < jokeType.length; i++) {
            if (jokeType[i].value === false) {
                falseCount++;
                falseIndex = i;
            }
        }

        if (falseCount === 1) {
            let check = url.includes('?');
            if (check) {
                url += `&type=${jokeType[1 ^ falseIndex].name}`
            }
            else {
                url += `?type=${jokeType[1 ^ falseIndex].name}`
            }
        }

        if (searchString !== '') {
            let check = url.includes('?');
            if (check) {
                url += `&contains=${searchString}`;
            }
            else {
                url += `?contains=${searchString}`;
            }
        }

        if (idRange) {
            if ((idFrom !== 0) || ((idFrom === 0 && idTo < this.state.max))) {
                let check = url.includes('?');
                if (check) {
                    url += `&idRange=${idFrom}-${idTo}`;
                }
                else {
                    url += `?idRange=${idFrom}-${idTo}`;
                }

            }
        }

        if (amountOfJoke > 1) {
            let check = url.includes('?');
            if (check) {
                url += `&amount=${amountOfJoke}`;
            }
            else {
                url += `?amount=${amountOfJoke}`;
            }

        }



        return url;
    }

    render() {

        return (
            <Formik
                initialValues={this.state.initialValues}
                validate={this.state.validate}
                onSubmit={(e) => this.state.onSubmit(e, this.geturl, this.state, this.setter)}
            >
                {
                    ({ values, handleChange, handleBlur, errors, resetForm }) => (
                        <div className="my-class">
                            {/* {console.log(REACT_VERSION)}     */}
                            <Container className="my-container shadow mb-4">
                                <Form>
                                    <Row className="edit-row">
                                        <Col sm={3} className="guide-text"> Select category / categories : </Col>
                                        <Col sm={9} className={`options border rounded border-${errors.category ? 'danger' : 'white'} p-2`}>

                                            <div className="form-check">
                                                <Field
                                                    type="radio"
                                                    id="ANY"
                                                    name="category"
                                                    value="Any"
                                                    className="form-check-input"
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
                                                    onChange={(e) => { this.checking(e, values) }}
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
                                        <Col sm={9} className={`options border rounded border-${errors.jokeType ? 'danger' : 'white'} p-2 mt-3`}>
                                            <div className="d-flex">
                                                {values.jokeType.map(({ name }, index) => <Checkbox

                                                    key={index}
                                                    className1="form-check mx-2"
                                                    className2="form-check-input"
                                                    className3="form-check-label"
                                                    name={`jokeType[${index}].value`}
                                                    label={name}
                                                    value={values.jokeType[index].value}
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
                                        <Col sm={9} className={`options border rounded border-${errors.idFrom ? 'danger' : 'white'} p-2 mt-3`}>
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
                                                        name="idFrom"
                                                        min="0"
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
                                                        min="0"
                                                        name="idTo"
                                                        value={values.idTo}
                                                        max={this.state.max}
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
                                                    name="amountOfJoke"
                                                    value={values.amountOfJoke}
                                                    min="1"
                                                />
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className="edit-row mt-4">
                                        <Col className="options border rounded border-white p-2 mt-3">
                                            <div>
                                                <div>
                                                    URL :<span className="" name="url">{this.geturl(values)}</span>

                                                    <div>
                                                        <Button
                                                            type="button"
                                                            variant="light"
                                                            className="mx-2 mt-2"
                                                            onClick={(values) => this.handleReset(resetForm, values)}
                                                        >Reset Form</Button>
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
                                                <div className="Footer p-4">

                                                    {this.state.error ? <h6 className="m-2 text-danger">{this.state.error}</h6> :
                                                        <>
                                                            {this.state.joke.map((one, index) => <h6 key={index} className="m-2">{one}</h6>)}
                                                        </>
                                                    }
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
