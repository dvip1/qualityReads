"use client"
import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio, Input, Textarea } from "@nextui-org/react";
import { FaPenNib } from "react-icons/fa";
import CreatePost, { postDataTypes } from "./createPost";
const PostComponent = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [url, setUrl] = useState('');

    const handleButtonClick = () => {
        console.log(title);
        onOpen();
    };

    const handleFormSubmit = async (e: any) => {
        e.preventDefault();
        const data: postDataTypes = {
            title: title,
            content: content,
            url: url
        }
        console.log(`somethingis happening here ${data}`);

    }
    const handleFormSub = async () => {
        const data: postDataTypes = {
            title: title,
            content: content,
            url: url
        }
        await CreatePost(data);
        console.log("complete!")
    };

    return (
        <div className="flex flex-col gap-2 py-2 ">
            <span className="flex max-w-[400px] items-center ">
                <Input type="text" label="Title" size="sm" className="px-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Button onClick={handleButtonClick} className="max-w-fit" color="primary"> <FaPenNib /> post</Button>
            </span>
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                placement={"auto"}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleFormSubmit}>
                            <ModalHeader className="flex flex-col gap-1"> {title || "change title !!"} </ModalHeader>
                            <ModalBody>
                                <Textarea
                                    label="Description"
                                    placeholder="Enter your description"
                                    className="max-w-xs"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <Input
                                    type="url"
                                    label="Website"
                                    placeholder="https://x.com/PatelDvip"
                                    labelPlacement="outside"
                                    isRequired
                                    required
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" type="submit" onClick={handleFormSub}>
                                    Post
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default PostComponent;