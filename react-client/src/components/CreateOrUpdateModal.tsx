import React from "react";
import {Button, ModalBody, ModalFooter, ModalTitle} from "react-bootstrap";
import Modal from 'react-bootstrap/Modal'
import ModalHeader from "react-bootstrap/ModalHeader";
import {useTranslation} from "react-i18next";

export function CreateOrUpdateModal(props: ICreateOrUpdateModalProps) {
    const {t} = useTranslation();

    return (
        <Modal size={props.size} show={true} centered={true} onHide={props.hide}>
            <ModalHeader closeButton>
                <ModalTitle>{props.title}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                {props.children}
            </ModalBody>
            <ModalFooter>
                <Button variant="secondary" onClick={props.hide}>{t("cancel")}</Button>
                <Button variant="primary" onClick={props.confirm}>{props.confirmText}</Button>
            </ModalFooter>
        </Modal>
    );
}

export interface ICreateOrUpdateModalProps {
    children: any;
    title: string;
    confirmText: string;
    size?: "sm" | "lg" | "xl" | undefined;
    hide(): void;
    confirm(): void;
}