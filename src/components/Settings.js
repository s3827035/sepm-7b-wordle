import {Modal, Form} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import toast from 'react-hot-toast';

function Settings(props) {

    return (

        <Modal show={props.open} onHide={props.close} animation={true}>

            <Modal.Header closeButton>
                <Modal.Title className="h4"><b>Settings</b></Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Form.Check
                    type="switch"
                    onChange={e => props.setDarkMode(e.target.checked)}
                    label="Dark Theme"
                />

                <Form.Check
                    type="switch"
                    onChange={e => props.setHighContrastMode(e.target.checked)}
                    label="High Contrast Mode"
                />

            </Modal.Body>

        </Modal>

    );

}

export default Settings;