import {Modal, Dropdown, DropdownButton} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import toast from 'react-hot-toast';

function Settings(props) {

    useEffect(() => {


    }, [props.open]);

    return (

        <Modal show={props.open} onHide={props.close} animation={true}>

            <Modal.Header closeButton>
                <Modal.Title className="h4"><b>Settings</b></Modal.Title>
            </Modal.Header>

            <Modal.Body>




            </Modal.Body>

        </Modal>

    );

}

export default Settings;