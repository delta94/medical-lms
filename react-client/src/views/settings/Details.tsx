import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import {Client, ClientApi, emptyClient} from "../../api/v1/ClientApi";
import Button from "react-bootstrap/Button";
import bsCustomFileInput from 'bs-custom-file-input'
import {useGlobalState} from "../../state/GlobalState";

export function Details(props: IDetailsProps) {
    const [, dispatch] = useGlobalState();
    const [details, setDetails] = useState<Client>(emptyClient());

    const {t} = useTranslation();

    const updateField = e => {
        setDetails({
            ...details,
            [e.target.name]: e.target.value
        });
    };

    if (details.id === 0 && props.clientId !== 0) {
        bsCustomFileInput.init();
        ClientApi.findById(props.clientId)
            .then(data => {
                setDetails(data);
            });
    }

    function submit() {
        ClientApi.update(props.clientId, details)
            .then(data => {
                dispatch({
                    type: "setClient",
                    newClient: data
                })
            });
    }

    //https://github.com/BosNaufal/react-file-base64/blob/master/src/js/components/react-file-base64.js
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        let files = e.target.files;
        if (files && files.length > 0) {
            let file = files[0];
            //If this is changed you must also change it on the server.
            if (["image/png","image/jpg", "image/jpeg", "image/svg", "image/svg+xml"].includes(file.type)) {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    let base64 = reader.result!!;
                    setDetails({
                        ...details,
                        logo: base64.toString()
                    });
                }
            } else {
                e.target.value = "";
            }
        }
    }

    return (
        <div>
            <h2>{t("details")}</h2>

            <Form>
                <FormGroup className="w-50">
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl name="name" type="text" defaultValue={details.name} onChange={updateField} />
                </FormGroup>
                <FormGroup className="w-50">
                    <FormLabel>{t("subdomain")}</FormLabel>
                    <FormControl name="subdomain" type="url" defaultValue={details.subdomain} onChange={updateField} />
                </FormGroup>
                <FormGroup className="w-50">
                    <FormLabel>{t("logo")}</FormLabel>
                    <Form.File accept="image/*" label="Select an image file" custom  onChange={handleImageUpload}/>
                </FormGroup>
                <Button onClick={submit}>{t("save")}</Button>
            </Form>
        </div>
    );
}

export interface IDetailsProps {
    clientId: number;
}