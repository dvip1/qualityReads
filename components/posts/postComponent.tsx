"use client"
import { ReactEventHandler, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio, Input, Textarea } from "@nextui-org/react";
import { FaPenToSquare } from "react-icons/fa6";
import CreatePost, { postDataTypes } from "./createPost";
import { parseHashtags, getHashtagsArray } from "./utils";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { primaryCategory, SelfImprovement, hobbies, lifestyle, categoryTypes } from "./data"
const PostComponent = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [url, setUrl] = useState('');
    const [primaryValue, setPrimaryValue] = useState<categoryTypes[]>(lifestyle)
    const [isSelected, setIsSelected] = useState(true);

    const [selectedValue, setSelectedValue] = useState('');
    const handleButtonClick = () => {
        console.log(title);
        onOpen();
    };

    const handleAutoCompleteChange = (value: string) => {
        console.log(`something in handleAuto ${value}`);
        if (value) {
            if (value === "Lifestyle")
                setPrimaryValue(lifestyle)
            else if (value === "Hobbies & Interests")
                setPrimaryValue(hobbies);
            else
                setPrimaryValue(SelfImprovement);
            setIsSelected(false);
        } else {
            setPrimaryValue(lifestyle);
            setIsSelected(true);
        }
    };

    const handleFormSub = async () => {
        const data: postDataTypes = {
            title: title,
            content: content,
            url: url,
            tags: getHashtagsArray(content),
            category: selectedValue
        }
        await CreatePost(data);
        setTitle("");
        setContent("");
        setUrl("");

        console.log("complete!")
        onOpenChange();
    }

    return (
        <div className="flex flex-col gap-2 py-2 ">
            <span className="flex max-w-[400px] items-center ">
                <Input type="text" label="Title" size="sm" className="px-2"
                    value={title}
                    maxLength={50}
                    onChange={(e) => setTitle(e.target.value)}

                />
                <Button onClick={handleButtonClick} className="max-w-fit" color="primary"> <span> <FaPenToSquare /></span> Write</Button>
            </span>
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                placement={"auto"}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <form >
                            <ModalHeader className="flex flex-col gap-1"> {title || "change title !!"} </ModalHeader>
                            <ModalBody>
                                <Textarea
                                    label="Description"
                                    placeholder="Enter your description"
                                    className="max-w-xs"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    maxLength={180}
                                />
                                <div className="flex flex-wrap">
                                    {parseHashtags(content)}
                                </div>
                                <Input
                                    label="Website"
                                    type="url"
                                    placeholder="https://x.com/PatelDvip"
                                    labelPlacement="outside"
                                    isRequired
                                    required
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                                <Autocomplete
                                    allowsCustomValue
                                    label="Search primary category"
                                    variant="bordered"
                                    size="md"
                                    className="max-w-xs"
                                    defaultItems={primaryCategory}
                                    onInputChange={(e) => handleAutoCompleteChange(e)}
                                >
                                    {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                                </Autocomplete>
                                <Autocomplete
                                    allowsCustomValue
                                    label="Search secondary category"
                                    variant="bordered"
                                    size="md"
                                    className="max-w-xs"
                                    defaultItems={primaryValue}
                                    isDisabled={isSelected}
                                    onInputChange={(e) => setSelectedValue(e)}
                                >
                                    {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                                </Autocomplete>
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
        </div >
    )
}

export default PostComponent;