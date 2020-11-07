import React, {useRef, useState} from "react";
import {Alert, Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {CreateOrUpdateModal} from "../../../components/CreateOrUpdateModal";
import {emptyResource, ResourceApi} from "../../../api/v1/ResourceApi";
import JoditEditor from "jodit-react";
import {useTranslation} from "react-i18next";
import If from "../../../components/If";

export default function CreateOrUpdateResource(props: ICreateOrUpdateResourceProps) {
    const [resource, setResource] = useState(emptyResource());
    const [error, setError] = useState("");

    const name = useRef<any>(null);
    const type = useRef<any>(null);
    const description = useRef<any>(null);
    const editor = useRef<any>(null);
    const {t} = useTranslation();

    const config = {
        readonly: false,
        buttons: [ 'source', '|',
            'bold', 'strikethrough', 'underline', 'italic', 'eraser', '|',
            'superscript', 'subscript', '|',
            'ul', 'ol', '|',
            'outdent', 'indent', 'align', '|',
            'font', 'fontsize', 'paragraph', 'brush',
            '|', 'image', 'file', 'video', 'table', 'link', '\n',
            'cut', 'copy', 'paste', 'copyformat', '|',
            'undo', 'redo', 'hr', 'symbol', 'fullsize', 'about'
        ],
        uploader: {
            insertImageAsBase64URI: true
        }
    };

    function submit() {
        setError("");
        resource.name = name.current.value;
        resource.type = type.current.value;
        resource.description = description.current.value;
        resource.html = editor.current.value;

        if (resource.name === "" || resource.type === "" || resource.description === "" || resource.html === "") {
            setError("All fields are required");
        }

        if (error === "") {
            if (props.resourceId) {
                ResourceApi.update(props.clientId, props.resourceId, resource)
                    .then(() => {
                        props.success();
                    });
            } else {
                ResourceApi.create(props.clientId, resource)
                    .then(() => {
                        props.success();
                    });
            }
        }
    }

    if (resource.id === 0) {
        if (props.resourceId) {
            ResourceApi.findById(props.clientId, props.resourceId)
                .then(data => {
                    setResource(data);
                })
        }
    }

    return (
        <div>
            <CreateOrUpdateModal size="xl" title={props.resourceId ? t("update-resource") : t("create-resource")}
                                 confirmText={props.resourceId ? t("update") : t("create")} hide={props.hide}
                                 confirm={submit}>
                <Form>
                    <FormGroup className="w-25">
                        <FormLabel>{t("name")}</FormLabel>
                        <FormControl ref={name} type="text" defaultValue={resource.name}/>
                    </FormGroup>
                    <FormGroup className="w-25">
                        <FormLabel>{t("category")}</FormLabel>
                        <FormControl ref={type} type="text" defaultValue={resource.type}>
                        </FormControl>
                    </FormGroup>
                    <FormGroup className="w-50">
                        <FormLabel>{t("Description")}</FormLabel>
                        <FormControl ref={description} type="text" defaultValue={resource.description}/>
                    </FormGroup>
                    <FormGroup>
                        <JoditEditor
                            key="editor"
                            value={resource.html}
                            ref={editor}
                            config={config}
                        />
                    </FormGroup>
                </Form>
                <If conditional={error !== "" && error !== null}>
                    <Alert variant="danger">
                        {error}
                    </Alert>
                </If>
            </CreateOrUpdateModal>
            <br/>
        </div>
    )

}

export interface ICreateOrUpdateResourceProps {
    clientId: number;
    resourceId?: number | null;

    success(): void;

    hide(): void;
}

