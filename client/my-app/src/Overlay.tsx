import {Modal, Button, Form, Input, Upload, Select, Radio} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React from 'react';
import {RadioChangeEvent} from "antd/es/radio";
import {layout, optionLayout, tailLayout, uploadProps} from "./FormLayouts";
import {MailOutlined} from "@ant-design/icons/lib";
import {UploadFile} from "antd/es/upload/interface";

const { Option } = Select;

interface overlayProps {
    visible: boolean;
    content: boolean;
    handleOk: () => void;
    handleCancel: () => void;
}

export class FoundOverlay extends React.Component<overlayProps> {

    state = {
        fileList: [],
    }

    render() {
        return (
            <div>
                <Modal
                    title="Found hat"
                    visible={this.props.visible}
                    onOk={this.props.handleOk}
                    onCancel={this.props.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.props.handleCancel}>
                            Cancel
                        </Button>,
                    ]}
                >

                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{ remember: true }}
                    >
                        { this.props.content ? <Form.Item
                            label="description"
                            name="content"
                            rules={[{ required: this.props.content, message: 'Description is required' }]}
                        >
                            <Input.TextArea allowClear />
                        </Form.Item> : null}

                        <Form.Item name="floor" label="floor" rules={[{ required: true,  message: 'Floor is required' }]}>
                            <Select
                                placeholder="Choose a floor..."
                                allowClear
                            >
                                <Option value="0">ground floor</Option>
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item {...tailLayout} name="image" rules={[{ required: true,  message: 'Image is required' }]}>
                        <Upload {...uploadProps(this, this.state.fileList)}>
                            <Button>
                                <UploadOutlined /> Send image
                            </Button>
                        </Upload>
                            </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                <MailOutlined/>Submit
                            </Button>
                        </Form.Item>


                    </Form>
                </Modal>
            </div>
        );
    }
}

export class LostOverlay extends React.Component<overlayProps> {

    state: {radioValue: string, fileList: UploadFile[]} = {
        radioValue: "choose",
        fileList: []
    };

    constructor(props: overlayProps) {
        super(props);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.state.radioValue = "choose";
    }

    handleRadioChange(event : RadioChangeEvent) {
        this.setState({
            radioValue: event.target.value,
        });
    };

    render() {
        return (
            <div>
                <Modal
                    title="Lost hat"
                    visible={this.props.visible}
                    onOk={this.props.handleOk}
                    onCancel={this.props.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.props.handleCancel}>
                            Cancel
                        </Button>,
                    ]}
                >

                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={async (values) => {
                            let formData = new FormData();
                            // Object.keys(values).map((item) => {
                            //     formData.append(item, values[item]);
                            // })

                            formData.append('metadata', 'twoja stara to kopara');
                            formData.append('image', this.state.fileList[0].originFileObj!);

                            // apiFetchAuth(true, 'dupa', {
                            let response = await fetch('http://localhost:4000/api/hats', {
                                method: 'POST',
                                body: formData
                            });
                            let result = await response.json();
                            console.log(result);
                        }}
                    >
                        <Form.Item
                            label="description"
                            name="content"
                            rules={[{ required: true, message: 'Description is required' }]}
                        >
                            <Input.TextArea allowClear/>
                        </Form.Item>

                        <Form.Item {...tailLayout} name="radio-options">
                            <Radio.Group onChange={this.handleRadioChange} defaultValue={"choose"}>
                                <Radio value={"choose"}>Choose from register hats

                                </Radio>

                                <Radio value={"upload"}> Add new image

                                </Radio>

                            </Radio.Group>
                        </Form.Item>

                        {this.state.radioValue === "choose" ?
                            <Form.Item {...optionLayout} name="hat" rules={[{ required: (this.state.radioValue === "choose"),  message: 'Hat is required' }]}>
                                <Select placeholder="Choose a hat..." allowClear>
                                    <Option value="czapka1">czapka1</Option>
                                    <Option value="czapka2">czapka2</Option>
                                </Select>
                            </Form.Item> : null}

                        {this.state.radioValue === "upload" ?
                            <Form.Item {...optionLayout} name="image" rules={[{ required: (this.state.radioValue === "upload"),  message: 'Image is required' }]}>
                                <Upload {...uploadProps(this, this.state.fileList)}>
                                    <Button>
                                        <UploadOutlined /> Send image
                                    </Button>
                                </Upload>
                            </Form.Item> : null}


                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                <MailOutlined/>Submit
                            </Button>
                        </Form.Item>


                    </Form>
                </Modal>
            </div>
        );
    }
}
