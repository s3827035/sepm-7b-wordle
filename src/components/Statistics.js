import {Modal, Dropdown, DropdownButton} from "react-bootstrap";

function Statistics(props) {

    return (

        <Modal show={props.open} onHide={props.close} animation={true}>

            <Modal.Header closeButton>
                <Modal.Title className="h4"><b>Statistics</b></Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <div id="statistics">
                    <div className="statistic-container">
                        <div className="statistic">4</div>
                        <div className="label">Played</div>
                    </div>

                    <div className="statistic-container">
                        <div className="statistic">0</div>
                        <div className="label">Win %</div>
                    </div>

                    <div className="statistic-container">
                        <div className="statistic">0</div>
                        <div className="label">Current Streak</div>
                    </div>

                    <div className="statistic-container">
                        <div className="statistic">0</div>
                        <div className="label">Max Streak</div>
                    </div>
                </div>

                <br/>

                <h4 className="h4"><b>Guess Distribution</b></h4>

                To be done.

                <br/>
                <br/>
                <br/>

                <div className="row">

                    <div className="col-md-6 col-sm-12 justify-content-center align-items-center">

                        <h4 className="h4"><b>Next Wordle</b></h4>

                        TIMER HERE

                    </div>

                    <div className="col-md-6 col-sm-12 justify-content-center align-items-center">

                        <DropdownButton id="dropdown-basic-button" title="Share" size="lg">
                            <Dropdown.Item href="#/action-1">Facebook</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Twitter</Dropdown.Item>
                        </DropdownButton>

                    </div>

                </div>

            </Modal.Body>
        </Modal>

    );

}

export default Statistics;
