import {Modal, Form} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import toast from 'react-hot-toast';

function Settings(props) {

    return (

        <Modal show={props.open} onHide={props.close} animation={true} className={"game " + (props.darkMode ? 'darkm' : '') + " " + (props.highContrastMode ? 'high-contrastm' : '')}>

            <Modal.Header closeButton>
                <Modal.Title className="h4"><b>Settings</b></Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Form.Check
                    type="switch"
                    checked={props.darkMode}
                    onChange={e => props.setDarkMode(e.target.checked)}
                    label="Dark Theme"
                />

                <Form.Check
                    type="switch"
                    checked={props.highContrastMode}
                    onChange={e => props.setHighContrastMode(e.target.checked)}
                    label="High Contrast Mode"
                />

            </Modal.Body>

        </Modal>

    );

}

export default Settings;